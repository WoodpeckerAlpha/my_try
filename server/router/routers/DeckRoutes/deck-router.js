const express = require("express");

const DeckController = require("../../../controllers/deck-controllers/deck-controller");
const authMiddleware = require("../../../exception/api-error")

const router = express.Router()

router.post("/create", authMiddleware,DeckController.createDeck)
router.get("/getDecks", authMiddleware, DeckController.getDecks)


