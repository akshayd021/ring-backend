const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    name: { type: String, required: true },
    img: { type: String },
    desc: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);


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
