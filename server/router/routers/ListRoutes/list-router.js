const express = require("express");

const ListController = require("../../../controllers/List-controllers/list-controller");
const authMiddleware = require("../../../middlewares/auth-middleware");

const router = express.Router();

router.post("/list", authMiddleware, ListController.createList);
router.delete("/list/:listId", authMiddleware, ListController.deleteList);
router.put("/list/:listId", authMiddleware, ListController.updateListData);
router.get("/list", authMiddleware, ListController.getAllLists);

module.exports = router;
