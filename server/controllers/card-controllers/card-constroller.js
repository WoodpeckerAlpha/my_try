const ApiError = require("../../exception/api-error");

const CardService = require("../../service/card-services/card-service");

class CardController {
	async createCard(req, res, next) {
		try {
			const deckId = req.body.data.deckId;
			const fields = req.body.data.fields;

			const createdCard = CardService.createCard(deckId, fields);
			if (createdCard !== true) {
				throw ApiError.BadRequest(
					"Something went wrong while creating card"
				);
			}
			return res.sendSuccessCode(200, "success");
		} catch (error) {
			console.log("Error while creating card:", error.message);
			next(error);
		}
	}

	async getCards(req, res, next) {
		try {
			const deckId = req.body.data.deckId;
			const limit = req.body.data.limit;

			const cards = await CardService.getCards(deckId, limit);
			if (cards !== true) {
				throw ApiError.BadRequest(
					"Something went wrong while getting cards"
				);
			}
			return res.sendResponse(200, cards);
		} catch (error) {
			console.log("Error while getting cards:", error.message);
			next(error);
		}
	}

	async getCards(req, res, next) {
		try {
			const deckId = req.body.data.deckId;

			const card = await CardService.getCards(deckId);
			if (card !== true) {
				throw ApiError.BadRequest(
					"Something went wrong while getting card"
				);
			}
			return res.sendResponse(200, card);
		} catch (error) {
			console.log("Error while getting card:", error.message);
			next(error);
		}
	}

	async getAnswer(req, res, next) {
		try {
			const cardId = req.body.data.cardId;
			const quality = req.body.data.quality;

			const card = await CardService.updateCardWithSM2(cardId, quality);
			if (card !== true) {
				throw ApiError.BadRequest(
					"Something went wrong while updating card"
				);
			}

			return res.sendResponse(200, card);
		} catch (error) {
			console.log("Error while updating card:", error.message);
			next(error);
		}
	}
}
