const StatusService = require("../../service/toDo-service/status-service");

class StatusController {
    async createStatus(req, res, next) {
        try {
            const userId = req.user.id;
            const { title, order, boardId, color } = req.body.data || {};

            const status = await StatusService.createStatus(
                userId,
                title,
                order,
                boardId,
                color
            );

            return res.sendResponse(200, status);
        } catch (error) {
            console.error("Error while creating status:", error);
            next(error);
        }
    }
}

module.exports = new StatusController();
