const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        variantId: { type: mongoose.Schema.Types.ObjectId }, // ✅ Must exist
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        diamond: { type: Object },
      },
    ],
    address: { type: Object, required: true },
    subtotal: Number,
    shippingCost: Number,
    discount: Number,
    total: Number,
    paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
    cardInfo: { type: Object },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancel", "returned"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
