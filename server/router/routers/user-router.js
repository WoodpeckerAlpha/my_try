const express = require("express");
const userController = require("../../controllers/user-controller");
const authMiddleware = require("../../middlewares/auth-middleware");

const router = express.Router();

router.get("/users", authMiddleware, userController.getUsers);
router.post("/user/delete", authMiddleware, userController.deleteAccount);
router.post(
	"/user/sendCode",
	authMiddleware,
	userController.sendVerificationCode
);
router.post(
	"/user/changePassword",
	authMiddleware,
	userController.changePassword
);

module.exports = router;
