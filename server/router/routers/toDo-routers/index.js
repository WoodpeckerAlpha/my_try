const express = require("express");

const boardRoutes = require("./boards-router");
const statusRouter = require("./status-router");

const router = express.Router();

router.use("/boards", boardRoutes);
router.use("/statuses", statusRouter);

module.exports = router;
