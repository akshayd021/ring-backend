const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    tempId: {
      type: String, // For temporary use until productId is available
    },
    variants: {
      type: Map, // key = variantId, value = variant valueId
      of: String,
      required: true,
    },
    originalPrice: { type: Number },
    price: { type: Number },
    quantity: { type: Number },
    discount: { type: Number },
    sku: { type: String },
    barcode: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
