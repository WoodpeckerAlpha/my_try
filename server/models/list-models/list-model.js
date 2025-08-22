const {Schema, model} = require("mongoose");

const ListSchema = new Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: "User", required: true},
		title: {type: String, required: true},
		textField: {type: String, default: ""},
	},
	{timestamps: true}
);

module.exports = model("List", ListSchema);
