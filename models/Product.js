const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    img: [{ type: String }], // Multiple image URLs
    size: [{ type: String }],
    variant: [{ type: String }],

    desc1: { type: String },
    desc2: { type: String },
    desc3: { type: String },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    tag: [{ type: String }],

    slug: { type: String, unique: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number }, // Can auto-calculate in controller
    stock: { type: Number, default: 0 },
    store: { type: Boolean, default: false },

    bestseller: { type: Boolean, default: false }, // ✅ New field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
