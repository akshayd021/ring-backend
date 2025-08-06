const mongoose = require("mongoose");

const customizeSchema = new mongoose.Schema(
    {

        product: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", require: true },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "customize",
    customizeSchema
);
