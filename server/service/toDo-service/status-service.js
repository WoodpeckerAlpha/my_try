const mongoose = require("mongoose");
const { StatusModel } = require("../../models/todo-models/index");
const ApiError = require("../../exception/api-error");
const ValidateField = require("../../utils/validateFields");
const StatusDto = require("../../dto/toDo-dto/status-dto");
const boardService = require("./board-service");

class StatusService {
    async findStatusById(statusId) {
        try {
            ValidateField.requiredFields({ statusId }, ["statusId"]);

            const status = await StatusModel.findById(statusId);
            if (!status) {
                throw ApiError.NotFound(`Status with ID ${statusId} not found`);
            }

            return status;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error while finding status:", error);
            throw ApiError.InternalError(
                "Something went wrong while finding the status"
            );
        }
    }

    async createStatus(user, title, order, boardId, color) {
        try {
            // Валидация обязательных полей
            ValidateField.requiredFields({ user, title, boardId }, [
                "user",
                "title",
                "boardId",
            ]);

            // Валидация типов
            if (typeof title !== "string" || title.trim() === "") {
                throw ApiError.BadRequest("Title must be a non-empty string");
            }
            if (order !== undefined && isNaN(parseInt(order, 10))) {
                throw ApiError.BadRequest("Order must be a valid number");
            }
            if (!mongoose.Types.ObjectId.isValid(boardId)) {
                throw ApiError.BadRequest("Invalid board ID");
            }
            if (
                color &&
                (typeof color !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(color))
            ) {
                throw ApiError.BadRequest(
                    "Color must be a valid HEX code (e.g., #FF0000)"
                );
            }

            // Проверка владения доской
            await boardService.ensureBoardOwnership(user, boardId);

            // Проверка уникальности названия статуса
            const existingStatuses = await this.getStatusesByBoardId(
                user,
                boardId
            );
            existingStatuses.forEach((status) => {
                if (status.name === title) {
                    throw ApiError.BadRequest(
                        "Status title must be unique within the board"
                    );
                }
            });

            // Создание статуса
            const status = await StatusModel.create({
                name: title,
                color: color || "#000000",
                order: order !== undefined ? parseInt(order, 10) : 0,
            });

            // Привязка статуса к доске
            const boardDto = await boardService.bindStatusToBoard(
                boardId,
                status._id.toString()
            );

            return {
                status: new StatusDto(status),
                board: boardDto,
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error while creating status:", error);
            throw ApiError.InternalError(
                "Something went wrong while creating the status"
            );
        }
    }

    async getStatusesByBoardId(user, boardId) {
        try {
            ValidateField.requiredFields({ user, boardId }, [
                "user",
                "boardId",
            ]);

            if (!mongoose.Types.ObjectId.isValid(boardId)) {
                throw ApiError.BadRequest("Invalid board ID");
            }

            const board = await boardService.findBoardById(user, boardId);
            return board.statuses.map((status) => new StatusDto(status));
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error("Error while retrieving statuses:", error);
            throw ApiError.InternalError(
                "Something went wrong while retrieving statuses"
            );
        }
    }
}

module.exports = new StatusService();
