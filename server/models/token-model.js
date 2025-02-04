// const { Schema, model, Types } = require("mongoose");

// const TokenSchema = new Schema({
//     user: { type: Types.ObjectId, ref: "User" },
//     refreshToken: { type: String, required: true },
// });

// module.exports = model("Token", TokenSchema);
const { Schema, model } = require("mongoose");

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
});

module.exports = model("Token", TokenSchema);
