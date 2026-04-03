const DeckModel = require("../../models/card-models/deck-model");
const UserModel = require("../../models/user-model");

const ApiError = require("../../exception/api-error");

class DeckService {
	async deckIsExist(deckId) {
		try {
			if (!deckId) {
				throw ApiError.BadRequest("Deck ID is required");
			}

			const deck = await DeckModel.findById(deckId);

			if (!deck) {
				throw ApiError.NotFound(`Deck with id ${deckId} not found`);
			}

			return deck;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while finding deck:", error);
			throw ApiError.InternalError(
				"Something went wrong while finding deck"
			);
		}
	}

	async createDeck(title, userId, fieldConfig) {
		try {
			if (!title) {
				throw ApiError.BadRequest("Deck title is required");
			}
			if (!userId) {
				throw ApiError.BadRequest("Deck userId is required");
			}
			if (!fieldConfig) {
				throw ApiError.BadRequest("Deck fieldConfig is required");
			}

			const user = await UserModel.findById(userId);
			if (!user) {
				throw ApiError.NotFound(`User with id ${userId} not found`);
			}

			const deck = await DeckModel.create({
				title: title,
				userId: userId,
				fieldConfig: fieldConfig,
			});

			return deck;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while creating deck:", error);
			throw ApiError.InternalError(
				"Something went wrong while creating deck"
			);
		}
	}

	async getDecks(userId, limit = 20, page = 1) {
		try {
			const skip = (page - 1) * limit;
			const decks = await DeckModel.find({userId: userId})
				.sort({createAt: -1})
				.limit(limit)
				.skip(skip);

			const total = await DeckModel.countDocuments({userId: userId});

			return {
				decks,
				pagination: {
					currentPage: page,
					pageSize: limit,
					totalItems: total,
					totalPages: Math.ceil(total / limit),
					hasNextPage: page < Math.ceil(total / limit),
					hasPrevPage: page > 1,
				},
			};
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			console.error("Error while getting deck:", error);
			throw ApiError.InternalError(
				"Something went wrong while getting deck"
			);
		}
	}
}

module.exports = new DeckService();
