const mongoose = require("mongoose");
const {BoardModel, TaskModel} = require("../../models/todo-models/index"); // Добавлен TaskModel
const ApiError = require("../../exception/api-error");
const ValidateField = require("../../utils/validateFields");
const AccessValidator = require("../../utils/AccessValidator");
const BoardDto = require("../../dto/toDo-dto/board-dto");
const BoardFullDto = require("../../dto/toDo-dto/boardFull-dto");
const taskService = require("./task-service");

class BoardService {
	async findBoardById(user, boardId) {
		try {
			ValidateField.requiredFields({user, boardId}, ["user", "boardId"]);

			if (!mongoose.Types.ObjectId.isValid(boardId)) {
				throw ApiError.BadRequest("Invalid board ID");
			}

			await AccessValidator.ensureOwnership(BoardModel, boardId, user);

			const board = await BoardModel.findById(boardId).populate(
				"statuses"
			);
			if (!board) {
				throw ApiError.NotFound(`Board with ID ${boardId} not found`);
			}

			return board;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while finding board:", error);
			throw ApiError.InternalError(
				"Something went wrong while finding the board"
			);
		}
	}

	async createBoard(user, title) {
		try {
			ValidateField.requiredFields({user, title}, ["user", "title"]);
			await ValidateField.uniqueField(BoardModel, "title", title);

			const board = await BoardModel.create({user, title});

			const boardDto = new BoardDto(board);
			return boardDto;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while creating board:", error);
			throw ApiError.InternalError(
				"Something went wrong while creating the board"
			);
		}
	}

	async deleteBoard(user, boardId) {
		try {
			ValidateField.requiredFields({user, boardId}, ["user", "boardId"]);

			if (!mongoose.Types.ObjectId.isValid(boardId)) {
				throw ApiError.BadRequest("Invalid board ID");
			}

			await AccessValidator.ensureOwnership(BoardModel, boardId, user);

			const deletedTasks = await taskService.deleteTasksByBoardId(
				boardId
			);

			const deletedBoard = await BoardModel.findByIdAndDelete(boardId);
            
			if (!deletedBoard) {
				throw ApiError.NotFound("Board not found");
			}

			return {
				data: {boardData: new BoardDto(deletedBoard), deletedTasks},
			};
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while deleting board:", error);
			throw ApiError.InternalError(
				"Something went wrong while deleting the board"
			);
		}
	}

	async getAllBoards(userId) {
		try {
			ValidateField.requiredFields({userId}, ["userId"]);

			const boards = await BoardModel.find({user: userId}).populate({
				path: "statuses",
				options: {sort: {order: 1}},
			});

			const tasks = await TaskModel.find({
				boardId: {$in: boards.map((b) => b._id)},
			});

			const results = {};
			boards.forEach((board) => {
				results[board._id] = {
					title: board.title,
					tasks: board.statuses.reduce((taskAcc, status) => {
						taskAcc[status._id] = tasks.filter(
							(task) =>
								task.statusId.toString() ===
								status._id.toString()
						);
						return taskAcc;
					}, {}),
				};
			});

			return results;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while retrieving boards:", error);
			throw ApiError.InternalError(
				"Something went wrong while retrieving boards"
			);
		}
	}

	async ensureBoardOwnership(userId, boardId) {
		try {
			ValidateField.requiredFields({userId, boardId}, [
				"userId",
				"boardId",
			]);

			if (!mongoose.Types.ObjectId.isValid(boardId)) {
				throw ApiError.BadRequest("Invalid board ID");
			}

			await AccessValidator.ensureOwnership(BoardModel, boardId, userId);
			return true;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while validating board ownership:", error);
			throw ApiError.InternalError(
				"Something went wrong while validating board ownership"
			);
		}
	}

	async bindStatusToBoard(boardId, statusId) {
		try {
			ValidateField.requiredFields({boardId, statusId}, [
				"boardId",
				"statusId",
			]);

			if (
				!mongoose.Types.ObjectId.isValid(boardId) ||
				!mongoose.Types.ObjectId.isValid(statusId)
			) {
				throw ApiError.BadRequest("Invalid board or status ID");
			}

			const board = await BoardModel.findById(boardId);
			if (!board) {
				throw ApiError.NotFound("Board not found");
			}

			board.statuses.push(statusId);
			await board.save();

			return new BoardDto(board);
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while binding status to board:", error);
			throw ApiError.InternalError(
				"Something went wrong while binding status to board"
			);
		}
	}

	async changeBoardTitle(boardId, newTitle, userId) {
		try {
			ValidateField.requiredFields({boardId, newTitle, userId}, [
				"boardId",
				"newTitle",
				"userId",
			]);

			if (!mongoose.Types.ObjectId.isValid(boardId)) {
				throw ApiError.BadRequest("Invalid board or status ID");
			}

			await AccessValidator.ensureOwnership(BoardModel, boardId, userId);

			const updatedBoard = await BoardModel.findByIdAndUpdate(
				boardId,
				{title: newTitle},
				{new: true}
			);

			if (!updatedBoard) {
				throw new ApiError.BadRequest(
					"Something went wrong while updating board title"
				);
			}

			return new BoardFullDto(updatedBoard);
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while updating board title:", error);
			throw ApiError.InternalError(
				"Something went wrong while updating board title"
			);
		}
	}
}

module.exports = new BoardService();
