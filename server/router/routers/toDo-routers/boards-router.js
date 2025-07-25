const express = require("express");
const boardController = require("../../../controllers/todo-controllers/board-controller");
const authMiddleware = require("../../../middlewares/auth-middleware");

const router = express.Router();

router.post("/board", authMiddleware, boardController.createBoard);
router.get("/boards", authMiddleware, boardController.getAllBoards);
router.delete("/board/:boardId", authMiddleware, boardController.deleteBoard);
router.post("/updateBoardTitle", authMiddleware, boardController.changeTitle);

module.exports = router;
