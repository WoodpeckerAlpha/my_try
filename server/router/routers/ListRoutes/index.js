const express = require("express");

const listRouter = require("./list-router");

const router = express.Router();

router.use("/list", listRouter);

module.exports = router;
