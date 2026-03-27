const DeckService = require("./deck-service");
const DeckModel = require("../../models/card-models/deck-model");
const UserModel = require("../../models/user-model");

const ApiError = require("../../exception/api-error");

jest.mock("../../models/card-models/deck-model");
jest.mock("../../models/user-model");

describe("Deck Service Test", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Create deck", () => {
		const title = "test";
		const userId = "507f1f77bcf86cd799439011";
		const fields = [
			{name: "word", type: "text"},
			{name: "pronounce", type: "text"},
			{name: "letterCount", type: "audio"},
		];

		const mockDeck = {
			_id: "507f1f77bcf86cd79943910",
			userId: userId,
			fieldConfig: fields,
			createdAt: new Date(),
		};

		const mockUser = {
			_id: userId,
			email: "test@example.com",
			name: "Test User",
		};

		it("should create deck", async () => {
			UserModel.findById.mockResolvedValue(mockUser);
			DeckModel.findOne.mockResolvedValue(null);
			DeckModel.create.mockResolvedValue(mockDeck);

			const result = await DeckService.createDeck(title, userId, fields);
			expect(DeckModel.create).toHaveBeenCalledTimes(1);
			expect(DeckModel.create).toHaveBeenCalledWith({
				title: title,
				fieldConfig: fields,
				userId: userId,
			});
			expect(result).toEqual(mockDeck);
		});
	});
});
