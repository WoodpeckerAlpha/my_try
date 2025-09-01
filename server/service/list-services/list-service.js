const mongoose = require("mongoose");

const ListModel = require("../../models/list-models/list-model");
const ListDTO = require("../../dto/List-DTO/List-DTO");

const ApiError = require("../../exception/api-error");

const ValidateField = require("../../utils/validateFields");
const AccessValidator = require("../../utils/AccessValidator");
const { ListIndexesCursor } = require("mongodb");

class ListService {
    async createList(user, listTitle) {
        try {
            ValidateField.requiredFields({ user, listTitle }, [
                "user",
                "listTitle",
            ]);
            await ValidateField.uniqueField(ListModel, "listTitle", listTitle);

            const list = await ListModel.create({
                user: user,
                title: listTitle,
            });

            const listDTO = new ListDTO(list);

            return listDTO;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error while creating list:", error);
            throw ApiError.InternalError(
                "Something went wrong while creating the list"
            );
        }
    }

    async deleteList(user, listId) {
        try {
            ValidateField.requiredFields({ user, listId }, ["user", "listId"]);

            if (!mongoose.Types.ObjectId.isValid(listId)) {
                throw ApiError.BadRequest("Invalid list ID");
            }

            await AccessValidator.ensureOwnership(ListModel, listId, user);

            const deletedList = await ListModel.findByIdAndDelete(listId);
            if (!deletedList) {
                throw ApiError.NotFound(
                    "Something went wrong while deleting list"
                );
            }

            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error while deleting list:", error);
            throw ApiError.InternalError(
                "Something went wrong while deleting the list"
            );
        }
    }

    async updateListData(user, listId, textFieldContent) {
        try {
            ValidateField.requiredFields({ user, listId }, ["user", "listId"]);
            if (!mongoose.Types.ObjectId.isValid(listId)) {
                throw ApiError.BadRequest("Invalid list ID");
            }
            await AccessValidator.ensureOwnership(ListModel, listId, user);

            const updatedList = await ListModel.findByIdAndUpdate(
                listId,
                { $set: { textField: textFieldContent } },
                { new: true, runValidators: true }
            );

            if (!updatedList) {
                throw ApiError.NotFound("List not found");
            }

            return new ListDTO(updatedList);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error while updating list text field:", error);
            throw ApiError.InternalError(
                "Something went wrong while updating the list text field"
            );
        }
    }

    async getAllLists(user) {
        try {
            ValidateField.requiredFields({ user }, ["user"]);

            const allLists = await ListModel.find({ user: user }).sort({
                createdAt: -1,
            });

            if (!allLists || allLists.length === 0) {
                return [];
            }

            const listsDTO = allLists.map((list) => new ListDTO(list));

            return listsDTO;
        } catch (error) {}
    }
}

module.exports = new ListService();
