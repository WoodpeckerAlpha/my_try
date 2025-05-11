const TaskService = require("../../service/toDo-service/task-service");

class TaskController {
    async createTask(req, res, next) {
        try {
            const userId = req.user.id;
            const taskData = req.body.data;
            const task = await TaskService.createTask(
                userId,
                taskData.boardId,
                taskData.title,
                taskData.statusId,
                (taskData.description = null)
            );

            return res.sendResponse(200, task);
        } catch (error) {
            console.log("Error whole creating the task:", error.message);
            next(error);
        }
    }
}

module.exports = new TaskController();
