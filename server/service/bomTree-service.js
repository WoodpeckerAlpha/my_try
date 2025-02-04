const BomTreeModel = require("../models/bomTree-model");

class BomTreeService {
    async createBomTree(data, createdBy, parent = null) {
        try {
            if (!data || !data.title) {
                throw new Error("Отсутствует title данных BOM-дерева");
            }

            // Создаем текущий узел
            const currentNode = await BomTreeModel.create({
                title: data.title,
                descriptions: data.descriptions,
                date: new Date(),
                createdBy: createdBy,
                viewers: [createdBy],
                editors: [createdBy],
                parent: parent
                    ? {
                          parentTitle: parent.title,
                          parentDate: parent.date,
                      }
                    : null,
                children: [], // Инициализируем массив детей
            });

            // Если есть дочерние элементы, рекурсивно создаем их
            if (data.children && data.children.length > 0) {
                for (const childData of data.children) {
                    const childNode = await this.createBomTree(
                        childData,
                        createdBy,
                        currentNode
                    );

                    // Добавляем ID дочернего узла в список детей родителя
                    currentNode.children.push(childNode._id);
                }

                // Сохраняем обновленный узел с дочерними ссылками
                await currentNode.save();
            }

            return currentNode;
        } catch (error) {
            console.log("Ошибка при создании BomTree:", error.message);
            throw error;
        }
    }

    async getAllTrees(user) {
        const trees = await BomTreeModel.find({ viewers: user }).select(
            "title date"
        );
        return trees;
    }

    async getIdByTitle(title) {
        try {
            const nodes = await BomTreeModel.find({ title: title }).select(
                "_id title date"
            );
            return nodes;
        } catch (error) {
            console.error("Ошибка при поиске узла по title:", error);
            throw error;
        }
    }

    async getTreeById(id) {
        try {
            const currentNode = await BomTreeModel.findById(id).lean();
            if (!currentNode) throw new Error("Узел не найден");

            const children = await BomTreeModel.find({
                "parent.parentTitle": currentNode.title,
                "parent.parentDate": currentNode.date,
            }).lean();

            currentNode.children = children;

            const buildParentHierarchy = async (node) => {
                if (node.parent && node.parent.parentTitle) {
                    const parent = await BomTreeModel.findOne({
                        title: node.parent.parentTitle,
                        date: node.parent.parentDate,
                    }).lean();

                    if (parent) {
                        parent.children = [node];
                        return await buildParentHierarchy(parent);
                    }
                }
                return node;
            };

            const hierarchy = await buildParentHierarchy(currentNode);

            return hierarchy;
        } catch (error) {
            console.log("Ошибка при получении дерева по ID:", error.message);
            throw error;
        }
    }
}

module.exports = new BomTreeService();
