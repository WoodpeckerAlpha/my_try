const { Schema, model } = require("mongoose");

const StatusSchema = new Schema({
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
    color: { type: String, required: true },
});

module.exports = model("Status", StatusSchema);
