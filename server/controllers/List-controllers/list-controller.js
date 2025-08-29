const ApiError = require("../../exception/api-error");
const ListService = require("../../service/list-services/list-service");

class ListController {
	async createList(req, res, next) {
		try {
			const userId = req.user.id;
			const listTitle = req.body.data.title;

			const list = await ListService.createList(userId, listTitle);
			return res.sendResponse(200, list);
		} catch (error) {
			console.log("Error while creating list:", error.message);
			next(error);
		}
	}

	async deleteList(req, res, next) {
		try {
			const userId = req.user.id;
			const listId = req.params.listId;
			const deletedListStatus = await ListService.deleteList(
				userId,
				listId
			);
			if (deletedListStatus !== true) {
				throw ApiError.BadRequest(
					"Something went wrong while deleting list"
				);
			}
			return res.sendSuccessCode(200, "success");
		} catch (error) {
			console.log("Error while deleting list:", error.message);
			next(error);
		}
	}

	async updateListData(req, res, next) {
		try {
			const userId = req.user.id;
			const listId = req.params.listId;

			console.log(req.body.data);
			const textFieldContent = req.body.data.textFieldContent;

			const updatedList = await ListService.updateListData(
				userId,
				listId,
				textFieldContent
			);

			return res.sendResponse(200, updatedList);
		} catch (error) {
			console.log("Error while updating list:", error.message);
			next(error);
		}
	}

	async getAllLists(req, res, next) {
		try {
			const userId = req.user.id;

			const allLists = await ListService.getAllLists(userId);

			return res.sendResponse(200, allLists);
		} catch (error) {}
	}
}

module.exports = new ListController();
