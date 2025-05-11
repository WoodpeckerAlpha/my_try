const express = require("express");

const StatusController = require("../../../controllers/todo-controllers/status-controller");
const authMiddleware = require("../../../middlewares/auth-middleware");

const router = express.Router();

router.post("/status", authMiddleware, StatusController.createStatus);

module.exports = router;
