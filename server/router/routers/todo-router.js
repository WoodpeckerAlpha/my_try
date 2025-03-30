const express = require("express");
const toDoController = require("../../controllers/toDo-controller");
const authMiddleware = require("../../middlewares/auth-middleware");

const router = express.Router();

router.post("/task", authMiddleware, toDoController.createTask);
router.put("/task", authMiddleware, toDoController.updateTask);
router.put("/task/complete", authMiddleware, toDoController.completeTask);
router.put("/task/uncomplete", authMiddleware, toDoController.unCompleteTask);
router.delete("/task", authMiddleware, toDoController.deleteTask);
router.get("/task", authMiddleware, toDoController.getAllTasks);

module.exports = router;
