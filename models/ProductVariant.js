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
    image: {
      type: [String], // This allows multiple URLs
      validate: {
        validator: function (arr) {
          return arr.every(url => typeof url === "string");
        },
        message: "All images must be URLs in string format.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
