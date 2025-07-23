const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema(
  {
    combination: {
      type: Object, // e.g., { attrId1: valueId1, attrId2: valueId2 }
      required: true,
    },
    price: Number,
    salePrice: Number,
    sku: String,
    barcode: String,
    quantity: Number,
    img: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },

    category: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      subcategories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subcategory",
        },
      ],
    },
    img: [{ type: String }],
    // size: [{ type: String }],
    // att: {
    //   id1: ["sub1", "sub2"],
    //   id2: ["sub3", "sub4"],
    // },
    att: {
      type: Map,
      of: [String],
      default: {},
    },
    // variant: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Variant",
    //   },
    // ],
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

    bestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
