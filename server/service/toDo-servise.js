const TodoTaskDto = require("../dto/toDoTask-dto");
const ApiError = require("../exception/api-error");
const {BoardModel, TaskModel} = require("../models/todo-model");

async function findAndValidateTask(taskId, userId) {
	const task = await TaskModel.findById(taskId);
	if (!task) throw ApiError.BadRequest("Задача не найдена");

	const board = await BoardModel.findById(task.board);
	if (!board) throw ApiError.BadRequest("Доска не найдена");
	if (board.user.toString() !== userId.toString()) {
		throw ApiError.BadRequest("Это не Ваша задача");
	}

	return {task, board};
}

class ToDoService {
	async createTask(userId, taskData) {
		let board = await BoardModel.findOne({
			user: userId,
			title: taskData.boardTitle,
		});

		if (!board) {
			board = await BoardModel.create({
				user: userId,
				title: taskData.boardTitle,
			});
		}

		const task = await TaskModel.create({
			board: board._id,
			title: taskData.task.title,
			description: taskData.task.description,
		});

		return {
			success: true,
			action: "task.created",
			data: {
				task: new TodoTaskDto(task).toJSON(),
			},
		};
	}

	async updateTask(userId, taskData) {
		const {task} = await findAndValidateTask(taskData.task.taskId, userId);

		task.set({
			title: taskData.task.title,
			status: taskData.task.status,
			description: taskData.task.description,
		});

		await task.save();

		return {
			success: true,
			action: "task.updated",
			data: {
				task: new TodoTaskDto(task).toJSON(),
			},
		};
	}

	async completeTask(userId, taskData) {
		const {task} = await findAndValidateTask(taskData.task.taskId, userId);

		task.set({
			status: "complete",
			finishedAt: Date.now(),
		});

		await task.save();

		return {
			success: true,
			action: "task.completed",
			data: {
				task: new TodoTaskDto(task).toJSON(),
			},
		};
	}

	async unCompleteTask(userId, taskData) {
		const {task} = await findAndValidateTask(taskData.task.taskId, userId);

		task.set({
			status: "pending",
			finishedAt: null,
		});

		await task.save();

		return {
			success: true,
			action: "task.uncompleted",
			data: {
				task: new TodoTaskDto(task).toJSON(),
			},
		};
	}

	async deleteTask(userId, taskData) {
		const {task} = await findAndValidateTask(taskData.task.taskId, userId);

		await TaskModel.deleteOne({_id: task._id});

		return {
			success: true,
			action: "task.deleted",
			data: {
				message: "Задача успешно удалена",
			},
		};
	}

	async getAllTasks(userId) {
		const boards = await BoardModel.find({user: userId}).lean();
		const boardIds = boards.map((b) => b._id);

		const tasks = await TaskModel.find({board: {$in: boardIds}})
			.populate("board", "title")
			.lean();

		const taskMap = tasks.reduce((acc, task) => {
			const boardId = task.board._id.toString();
			if (!acc[boardId]) acc[boardId] = [];
			acc[boardId].push(
				new TodoTaskDto(task, {includeBoardTitle: true}).toJSON()
			);
			return acc;
		}, {});

		const result = boards.map((board) => ({
			id: board._id,
			title: board.title,
			tasks: taskMap[board._id.toString()] || [],
		}));

		return {
			success: true,
			action: "boards.fetched",
			data: {
				boards: result,
			},
		};
	}
}

module.exports = new ToDoService();
