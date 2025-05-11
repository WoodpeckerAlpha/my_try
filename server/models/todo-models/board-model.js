const { Schema, model } = require("mongoose");

const BoardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: { type: String, required: true },
    statuses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Status",
        },
    ],
});

module.exports = model("Board", BoardSchema);
