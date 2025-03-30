const express = require("express");
const userController = require("../../controllers/user-controller");
const { body } = require("express-validator");

const router = express.Router();

router.post(
    "/registration",
    body("email").isEmail().withMessage("Неверный формат email"),
    body("password")
        .isLength({ min: 3, max: 32 })
        .withMessage("Пароль должен быть не менее 3 и не более 32 символов"),
    userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);

module.exports = router;
