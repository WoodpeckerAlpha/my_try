const ApiError = require("../../exception/api-error");

const DeckService = require("../../service/deck-services/deck-service");

class DeckController {
	async createDeck(req, res, next) {
		try {
			const userId = req.user.id;
			const title = req.body.data.title;
			const fieldConfig = req.body.data.fieldConfig;

			const createdDeck = await DeckService.createDeck(
				title,
				userId,
				fieldConfig
			);
			return res.sendSuccessCode(200, "success");
		} catch (error) {
			console.log("Error while creating list:", error.message);
			next(error);
		}
	}

	async getDecks(req, res, next) {
		try {
			const userId = req.user.id;
			const limit = req.body.data.limit;
			const page = req.body.data.page;

			const lookedPage = DeckService.getDecks(userId, limit, page);
			if (lookedPage !== true) {
				throw ApiError.BadRequest(
					"Something went wrong while getting list"
				);
			}

			res.sendResponse(200, lookedPage);
		} catch (error) {
			console.log("Error while deleting list:", error.message);
			next(error);
		}
	}
}

module.exports = new DeckController();
