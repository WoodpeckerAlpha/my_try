const Router = require("express").Router();
const BomTreeController = require("../../controllers/bomTree-controller");
const { body } = require("express-validator");

const router = new Router();

// router.post("/tree", authMiddleware, bomTreeController.createBomTree);
// router.get("/trees", authMiddleware, bomTreeController.getAllTrees);
// router.get("/tree/:id", authMiddleware, bomTreeController.getTreeById);
// router.get(
//     "/tree/title/:title",
//     authMiddleware,
//     bomTreeController.getIdByTitle
// );

module.exports = router;
