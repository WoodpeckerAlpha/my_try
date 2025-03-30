const { Schema, model } = require("mongoose");

const BoardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: { type: String, required: true },
});

const TaskSchema = new Schema(
    {
        board: {
            type: Schema.Types.ObjectId,
            ref: "Board",
            required: true,
            index: true,
        },
        title: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "in_progress", "complete"],
            default: "pending",
        },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
        finishedAt: { type: Date },
    },
    { timestamps: true }
);

const BoardModel = model("Board", BoardSchema);
const TaskModel = model("Task", TaskSchema);

module.exports = { BoardModel, TaskModel };
