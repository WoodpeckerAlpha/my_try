const { Schema, model } = require("mongoose");

const BomTreeSchema = new Schema(
    {
        title: { type: String, required: true },
        descriptions: { type: String },
        date: { type: Date, required: true },
        parent: {
            parentTitle: { type: String },
            parentDate: { type: Date },
        },
        children: [
            {
                childTitle: { type: String },
                childDate: { type: Date },
            },
        ],
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        editors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

BomTreeSchema.index({ title: 1, date: 1 }, { unique: true });

module.exports = model("BomTree", BomTreeSchema);
