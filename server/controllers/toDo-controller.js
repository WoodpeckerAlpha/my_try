const toDoService = require("../service/toDo-servise");

class ToDoController {
    // handleRequest теперь будет просто вызывать методы сервиса без использования `call`
    async handleRequest(req, res, next, serviceMethod) {
        try {
            const taskData = req.body;
            const userId = req.user.id;
            const task = await serviceMethod(userId, taskData); // Просто вызываем метод сервиса

            return res.json(task);
        } catch (error) {
            console.log(`Ошибка в ${serviceMethod.name}:`, error.message);
            next(error);
        }
    }

    // Стрелочные функции для сохранения контекста `this`
    createTask = async (req, res, next) => {
        return this.handleRequest(req, res, next, toDoService.createTask);
    };

    updateTask = async (req, res, next) => {
        return this.handleRequest(req, res, next, toDoService.updateTask);
    };

    completeTask = async (req, res, next) => {
        return this.handleRequest(req, res, next, toDoService.completeTask);
    };

    unCompleteTask = async (req, res, next) => {
        return this.handleRequest(req, res, next, toDoService.unCompleteTask);
    };

    deleteTask = async (req, res, next) => {
        return this.handleRequest(req, res, next, toDoService.deleteTask);
    };

    // Здесь можно оставить без изменений, так как метод отличается
    async getAllTasks(req, res, next) {
        try {
            const userId = req.user.id;
            const task = await toDoService.getAllTasks(userId);
            return res.json(task);
        } catch (error) {
            console.log(`Ошибка при получении всех задач`, error.message);
            next(error);
        }
    }
}

module.exports = new ToDoController();
