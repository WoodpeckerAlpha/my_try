const BoardService = require("../../service/toDo-service/board-service");

class BoardController {
	async createBoard(req, res, next) {
		try {
			const userId = req.user.id;
			const boardTitle = req.body.data.title;
			const board = await BoardService.createBoard(userId, boardTitle);
			return res.sendResponse(200, board);
		} catch (error) {
			console.log("Ошибка при создании доски:", error.message);
			next(error);
		}
	}

	async getAllBoards(req, res, next) {
		try {
			const userId = req.user.id;
			const boards = await BoardService.getAllBoards(userId);

			return res.sendResponse(200, {...boards});
		} catch (error) {
			console.log("Ошибка при получении всех досок:", error.message);
			next(error);
		}
	}

	async deleteBoard(req, res, next) {
		try {
			const userId = req.user.id;
			const boardId = req.params.boardId;
			const deletedBoard = await BoardService.deleteBoard(
				userId,
				boardId
			);
			return res.sendResponse(200, deletedBoard);
		} catch (error) {
			console.log("Ошибка при удалении доски:", error.message);
			next(error);
		}
	}

	async changeTitle(req, res, next) {
		try {
			const userId = req.user.id;
			const boardId = req.body.boardId;
			const newTitle = req.body.newTitle;

			const updatedBoard = await BoardService.changeBoardTitle(
				boardId,
				newTitle,
				userId
			);

			return res.sendResponse(200, updatedBoard);
		} catch (error) {
			console.log("Ошибка при изменении заголовка доски:", error.message);
			next(error);
		}
	}
}

module.exports = new BoardController();
