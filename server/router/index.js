const express = require("express");

const authRoutes = require("./routers/auth-router");
const userRoutes = require("./routers/user-router");
const todoRoutes = require("./routers/todo-router");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/todo", todoRoutes);

module.exports = router;
