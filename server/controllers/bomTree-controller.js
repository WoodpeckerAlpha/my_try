const BomTreeService = require("../service/bomTree-service");

class BomTreeController {
    async createBomTree(req, res, next) {
        try {
            console.log("req.user", req.user.id);

            const treeData = req.body;
            const createdBy = req.user.id;
            const bomTreeData = await BomTreeService.createBomTree(
                treeData,
                createdBy
            );
            return res.json(bomTreeData);
        } catch (error) {
            console.log(
                "Ошибка при создании дерева в контроллере:",
                error.message
            );
            next(error);
        }
    }

    async getAllTrees(req, res, next) {
        try {
            const user = req.user.id;
            const trees = await BomTreeService.getAllTrees(user);
            res.json(trees);
        } catch (error) {
            console.log(
                "ошибка получения всех деревьев в контроллере" + error.message
            );
            next(error);
        }
    }

    async getIdByTitle(req, res, next) {
        try {
            const { title } = req.params;
            const node = await BomTreeService.getIdByTitle(title);

            if (node) {
                return res.json({ node });
            } else {
                return res.status(404).json({ message: "Узел не найден" });
            }
        } catch (error) {
            console.error("Ошибка при получении узла по title", error);
            next(error);
        }
    }

    async getTreeById(req, res, next) {
        try {
            const { id } = req.params;
            const tree = await BomTreeService.getTreeById(id);
            res.json(tree);
        } catch (error) {
            console.log("Ошибка при получении дерева по ID:", error.message);
            next(error);
        }
    }
}

module.exports = new BomTreeController();
