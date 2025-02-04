const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const bomTreeController = require("../controllers/bomTree-controller");
const router = new Router();
const { body, query } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

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
router.get("/users", authMiddleware, userController.getUsers);

router.post("/tree", authMiddleware, bomTreeController.createBomTree);
router.get("/trees", authMiddleware, bomTreeController.getAllTrees);
router.get("/tree/:id", authMiddleware, bomTreeController.getTreeById);
router.get(
    "/tree/title/:title",
    authMiddleware,
    bomTreeController.getIdByTitle
);

module.exports = router;
