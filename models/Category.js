const mongoose = require("mongoose");

// ✅ Define subcategory schema as a subdocument
const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String },
    desc: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// ✅ Define category schema with embedded subcategories
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String },
    desc: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    subcategories: [subcategorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
