const {Schema, model} = require("mongoose");

const CardSchema = new Schema(
	{
		deckId: {
			type: Schema.Types.ObjectId,
			ref: "Deck",
			required: true,
			index: true,
		},
		fields: [
			{
				name: String,
				value: String,
			},
		],
		learning: {
			nextReview: {type: Date, default: Date.now, index: true},
			interval: {type: Number, default: 0}, //дни до след повторения
			repetition: {type: Number, default: 0}, //сколько каз подрят ответил правильно
			efactor: {type: Number, default: 2.5}, //фактор сложности
		},
	},
	{timestamps: true}
);

module.exports = model("Card", CardSchema);
