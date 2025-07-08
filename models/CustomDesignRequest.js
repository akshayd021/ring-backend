const mongoose = require("mongoose");

const customDesignRequestSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    nation: { type: String, required: true },

    product: {
      type: { type: String, required: true }, // e.g. Ring, Necklace
      variant: { type: String }, // e.g. Gold, Silver
      desc: { type: String },
      img: { type: String }, // could be Cloudinary or direct URL
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "in-progress", "completed", "rejected"],
      default: "pending",
    },

    notes: { type: String }, // admin notes or internal comments
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CustomDesignRequest",
  customDesignRequestSchema
);
