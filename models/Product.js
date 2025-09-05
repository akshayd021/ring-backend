const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  combination: {
    type: Object,
    required: true,
  },
  combinationString: { type: String },
  price: Number,
  salePrice: Number,
  sku: String,
  barcode: String,
  quantity: Number,
  img: [{ type: String }],
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },

    category: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      subcategories: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
      ],
    },
    img: [{ type: String }],

    att: {
      type: Map,
      of: [String],
      default: {},
    },
    variants: [VariantSchema],

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
    discount: { type: Number },
    stock: { type: Number, default: 0 },
    store: { type: Boolean, default: false },
    variantsEnabled: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
