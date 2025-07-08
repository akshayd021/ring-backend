const mongoose = require("mongoose");

const contactSectionSchema = new mongoose.Schema(
  {
    img: { type: String, required: true }, // banner image
    title: { type: String },               // optional
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactSection", contactSectionSchema);
