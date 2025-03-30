const { finished } = require("nodemailer/lib/xoauth2");
const ApiError = require("../exception/api-error");
const { BoardModel, TaskModel } = require("../models/todo-model");

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
        return task;
    }

    async updateTask(userId, taskData) {
        const task = await TaskModel.findById(taskData.task.taskId);
        if (!task) throw ApiError.BadRequest("Задача не найдена");
        const board = await BoardModel.findById(task.board);
        if (!board) throw ApiError.BadRequest("Доска не найдена");
        if (board.user.toString() !== userId.toString()) {
            throw ApiError.BadRequest("Это не Ваша задача");
        }

        task.set({
            title: taskData.task.title,
            status: taskData.task.status,
            description: taskData.task.description,
        });
        await task.save();

        return task;
    }

    async completeTask(userId, taskData) {
        const task = await TaskModel.findById(taskData.task.taskId);
        if (!task) throw ApiError.BadRequest("Задача не найдена");
        const board = await BoardModel.findById(task.board);
        if (!board) throw ApiError.BadRequest("Доска не найдена");
        if (board.user.toString() !== userId.toString()) {
            throw ApiError.BadRequest("Это не Ваша задача");
        }

        task.set({
            status: taskData.task.status,
            finishedAt: Date.now(),
        });
        await task.save();

        return task;
    }

    async unCompleteTask(userId, taskData) {
        const task = await TaskModel.findById(taskData.task.taskId);
        if (!task) throw ApiError.BadRequest("Задача не найдена");
        const board = await BoardModel.findById(task.board);
        if (!board) throw ApiError.BadRequest("Доска не найдена");
        if (board.user.toString() !== userId.toString()) {
            throw ApiError.BadRequest("Это не Ваша задача");
        }

        task.set({
            status: taskData.task.status,
            finishedAt: null,
        });
        await task.save();

        return task;
    }

    async deleteTask(userId, taskData) {
        const task = await TaskModel.findById(taskData.task.taskId);
        if (!task) throw ApiError.BadRequest("Задача не найдена");
        const board = await BoardModel.findById(task.board);
        if (!board) throw ApiError.BadRequest("Доска не найдена");
        if (board.user.toString() !== userId.toString()) {
            throw ApiError.BadRequest("Это не Ваша задача");
        }

        await TaskModel.deleteOne({ _id: task._id });

        return { message: "Задача уcпешно удалена" };
    }

    async getAllTasks(userId) {
        const boards = await BoardModel.find({ user: userId }).lean(); // lean() ускоряет работу
        const boardIds = boards.map((board) => board._id);

        const tasks = await TaskModel.find({ board: { $in: boardIds } }).lean();

        const taskMap = tasks.reduce((acc, task) => {
            const boardId = task.board.toString();
            if (!acc[boardId]) acc[boardId] = [];
            acc[boardId].push(task);
            return acc;
        }, {});

        const result = boards.map((board) => ({
            ...board,
            tasks: taskMap[board._id.toString()] || [],
        }));

        return result;
    }
}

module.exports = new ToDoService();
