const mongoose = require("mongoose");

const customDesignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    img: { type: String, required: true },
    link: { type: String }, 
    type: {
      type: String,
      enum: ["banner", "section", "promo", "other"],
      default: "banner",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomDesign", customDesignSchema);
