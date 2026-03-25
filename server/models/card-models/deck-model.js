const {Schema, model} = require("mongoose");

const DeckSchema = new Schema({
	title: {type: String, require: true},
	userId: {type: Schema.Types.ObjectId, ref: "User", index: true},
	fieldConfig: [
		{
			name: String,
			filedType: {
				type: String,
				enum: ["text", "audio", "image"],
				default: "text",
			},
		},
	],
	createAt: {type: Date, default: Date.now},
});

module.exports = model("Deck", DeckSchema);
