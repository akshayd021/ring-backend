const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String },
    desc: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
