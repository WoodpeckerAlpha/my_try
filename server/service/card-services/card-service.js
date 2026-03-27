const CardModel = require("../../models/card-models/card-model");
const DeckService = require("../deck-services/deck-service");

const ApiError = require("../../exception/api-error");

class CardService {
	async createCard(deckId, fields, parameters) {
		try {
			const deck = await DeckService.deckIsExist(deckId);
			const card = await CardModel.create({
				deckId: deckId,
				fields: [fields],
				learning: {...parameters},
			});
			return card;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while creating list:", error);
			throw ApiError.InternalError(
				"Something went wrong while creating the list"
			);
		}
	}
}   

module.exports = new CardService();
