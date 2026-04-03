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
			console.error("Error while creating card:", error);
			throw ApiError.InternalError(
				"Something went wrong while creating card"
			);
		}
	}

	async getCards(deckId, limit = 20) {
		try {
			const deck = await DeckService.deckIsExist(deckId);
			const cards = await CardModel.find({deckId})
				.sort({"learning.nextReview": -1})
				.limit(limit);
			return cards;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			console.error("Error while getting cards:", error);
			throw ApiError.InternalError(
				"Something went wrong while getting cards"
			);
		}
	}

	async getCard(deckId) {
		try {
			const deck = await DeckService.deckIsExist(deckId);
			const card = await CardModel.findOne({deckId}).sort({
				"learning.nextReview": -1,
			});
			return card;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			console.error("Error while getting card:", error);
			throw ApiError.InternalError(
				"Something went wrong while getting card"
			);
		}
	}

	//Обновление карточки по алгоритму SM-2
	//param {string} cardId - ID карточки
	//param {number} quality - оценка качества ответа (0-5)
	//0 - полный провал, не вспомнил
	//1 - ошибка, но узнал ответ
	//2 - ошибка, но ответ был знаком
	//3 - правильно, но с трудом
	//4 - правильно, с небольшим усилием
	//5 - идеально, сразу вспомнил

	async updateCardWithSM2(cardId, quality) {
		try {
			const card = await CardModel.findById(cardId);
			if (!card) {
				throw ApiError.NotFound("Card not found");
			}
			let {interval, repetition, efactor} = card.learning;

			if (quality >= 3) {
				if (repetition === 0) {
					interval = 1;
				} else if (repetition === 1) {
					interval = 6;
				} else {
					interval = Math.round(interval * efactor);
				}
				repetition++;
			} else {
				repetition = 0;
				interval = 1;
			}
			if (quality >= 3) {
				efactor =
					efactor +
					(0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

				if (efactor < 1.3) efactor = 1.3;
				if (efactor > 2.5) efactor = 2.5;
			}
			const nextReview = new Date();
			nextReview.setDate(nextReview.getDate() + interval);
			const updatedCard = await CardModel.findByIdAndUpdate(
				cardId,
				{
					"learning.interval": interval,
					"learning.repetition": repetition,
					"learning.efactor": efactor,
					"learning.nextReview": nextReview,
				},
				{new: true}
			);

			return true;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			console.error("Error while getting card:", error);
			throw ApiError.InternalError(
				"Something went wrong while getting card"
			);
		}
	}
}

module.exports = new CardService();
