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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    userInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "card", "upi"], required: true },
    cardInfo: {
      cardNumber: { type: String },
      cardName: { type: String },
      expiry: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
