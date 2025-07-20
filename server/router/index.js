const express = require("express");

const authRoutes = require("./routers/auth-router");
const userRoutes = require("./routers/user-router");
const todoRoutes = require("./routers/toDo-routers/index");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/todo", todoRoutes);

router.use((req, res, next) => {
	console.log(
		`[${new Date().toISOString()}] Route not found: ${req.originalUrl}`
	);
	res.status(404).send("Not found");
});

module.exports = router;
