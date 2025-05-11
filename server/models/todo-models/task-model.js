const { Schema, model } = require("mongoose");

const TaskSchema = new Schema(
    {
        board: {
            type: Schema.Types.ObjectId,
            ref: "Board",
            required: true,
            index: true,
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: "Status",
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
        finishedAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = model("Task", TaskSchema);
