const mongoose = require("mongoose");

const TaskDto = require("../../dto/toDo-dto/task-dto");

const ApiError = require("../../exception/api-error");

const ValidateField = require("../../utils/validateFields");

const BoardService = require("./board-service");

const { TaskModel } = require("../../models/todo-models/index");

class TaskService {
    async createTask(user, boardId, title, statusId, description = null) {
        try {
            ValidateField.requiredFields({ user, boardId, title, statusId }, [
                "user",
                "boardId",
                "title",
                "statusId",
            ]);

            const board = await BoardService.findBoardById(user, boardId);
            if (!board) {
                throw ApiError.NotFound(`Board with ID ${boardId} not found`);
            }

            const task = await TaskModel.create({
                board: boardId,
                title,
                description,
                status: statusId,
            });
            await task.populate("status");

            return new TodoTaskDto(task);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error creating task: ", error);
            throw ApiError.InternalError(
                "Something went wrong while creating the task"
            );
        }
    }

    async getTasksByStatusId(statusId) {
        try {
            ValidateField.requiredFields({ statusId }, ["statusId"]);

            const tasks = await TaskModel.find({ status: statusId })
                .sort({ order: 1 })
                .lean();

            if (!tasks) {
                return [];
            }

            return tasks.map((task) => new TaskDto(task));
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error get tasks by status id: ", error);
            throw ApiError.InternalError(
                "Something went wrong while getting tasks the task"
            );
        }
    }

    async deleteTask(userId, taskId) {
        try {
            ValidateField.requiredFields({ userId, taskId }, [
                "userId",
                "taskId",
            ]);

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                throw ApiError.BadRequest("Некорректный ID задачи");
            }

            const task = await TaskModel.findById(taskId);
            if (!task) {
                throw ApiError.NotFound("Задача не найдена");
            }

            await BoardService.ensureBoardOwnership(userId, task.board);

            const deleteResult = await task.deleteOne();
            if (deleteResult.deletedCount === 0) {
                throw ApiError.InternalError("Не удалось удалить задачу");
            }

            return new TaskDto(task);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error deleting task: ", error);
            throw ApiError.InternalError(
                "Something went wrong while deleting task"
            );
        }
    }

    async getTasksByBoardId(boardId) {
        try {
            ValidateField.requiredFields({ boardId }, ["boardId"]);

            const results = await TaskModel.find({ board: boardId });

            return results.map((task) => new TaskDto(task));
        } catch (error) {}
    }

    async deleteTasksByBoardId(boardId) {
        try {
            ValidateField.requiredFields({ boardId }, ["boardId"]);

            if (!mongoose.Types.ObjectId.isValid(boardId)) {
                throw ApiError.BadRequest("Некорректный ID доски");
            }

            const tasks = await TaskModel.find({ board: boardId }).lean();

            if (tasks.length === 0) {
                return [];
            }

            const deleteResult = await TaskModel.deleteMany({ board: boardId });

            if (deleteResult.deletedCount !== tasks.length) {
                throw ApiError.InternalError(
                    `Ожидалось удаление ${tasks.length} задач, но удалено ${deleteResult.deletedCount}`
                );
            }

            console.log(
                `Удалено задач: ${deleteResult.deletedCount} для доски ${boardId}`
            );
            return tasks.map((task) => new TaskDto(task));
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            console.error("Ошибка при удалении задач по доске:", error);
            throw ApiError.InternalError(
                "Что-то пошло не так при удалении задач"
            );
        }
    }
}

module.exports = new TaskService();
