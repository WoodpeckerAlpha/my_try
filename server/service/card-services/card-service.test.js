const CardService = require("./card-service");
const DeckService = require("../deck-services/deck-service");
const CardModel = require("../../models/card-models/card-model");

const ApiError = require("../../exception/api-error");

jest.mock("../../models/card-models/card-model");
// jest.mock("../../exception/api-error");
jest.mock("../deck-services/deck-service");

describe("CardServiceTest", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("CreateCard", () => {
		const deckId = "507f1f77bcf86cd799439011";
		const fields = [
			{name: "word", value: "testWord"},
			{name: "pronounce", value: "тестворд"},
			{name: "letterCount", value: "8"},
		];
		const date = new Date();
		const learningParams = {
			nextReview: date,
			interval: 0,
			repetition: 0,
			efactor: 2.5,
		};

		const mockCreatedCard = {
			_id: "507f1f77bcf86cd799439012",
			deckId: deckId,
			fields: fields,
			learning: learningParams,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const mockDeck = {
			_id: deckId,
			name: "Test Deck",
		};

		it("should create card", async () => {
			DeckService.deckIsExist.mockResolvedValue(mockDeck);
			CardModel.create.mockResolvedValue(mockCreatedCard);

			const result = await CardService.createCard(
				deckId,
				fields,
				learningParams
			);

			expect(CardModel.create).toHaveBeenCalledTimes(1);
			expect(CardModel.create).toHaveBeenCalledWith({
				deckId: deckId,
				fields: [fields],
				learning: learningParams,
			});
			expect(result).toEqual(mockCreatedCard);
		});

		it("should throw error if deck does not exist", async () => {
			const notFoundError = ApiError.NotFound(
				`Deck with id ${deckId} not found`
			);
			DeckService.deckIsExist.mockRejectedValue(notFoundError);

			await expect(
				CardService.createCard(deckId, fields, learningParams)
			).rejects.toThrow(`Deck with id ${deckId} not found`);

			expect(CardModel.create).not.toHaveBeenCalled();
			expect(DeckService.deckIsExist).toHaveBeenCalledWith(deckId);
		});
	});
});
