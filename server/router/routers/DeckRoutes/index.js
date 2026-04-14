const express = require("express");

const deckRouter = require("./deck-router");

const router = express.Router();

router.use("/deck", deckRouter);

module.exports = router;