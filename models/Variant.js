const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  displayValue: {
    type: String,
    required: true,
  },
  option: {
    type: String,
    enum: ["dropdown", "radio"],
    required: true,
  },
  variants: [
    {
      value: { type: String, required: true },
      img: { type: String },
      combination: { type: String },
      sku: { type: String },
      barcode: { type: String },
      price: { type: Number },
      salePrice: { type: Number },
      quantity: { type: Number, default: 0 },
      status: { type: String, enum: ["show", "hide"], default: "show" },
    },
  ],
  status: {
    type: String,
    enum: ["show", "hide"],
    default: "show",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Variant", variantSchema);
