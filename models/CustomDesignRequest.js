// models/CustomDesignRequest.js
const mongoose = require("mongoose");

const customDesignRequestSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    nation: { type: String, required: true },

    product: {
      type: { type: String, required: true },
      variant: { type: String },
      desc: { type: String },

      // Multiple images
      images: { type: [String], default: [] },

      // Multiple videos
      videos: { type: [String], default: [] },
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "in-progress", "completed", "rejected"],
      default: "pending",
    },

    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomDesignRequest", customDesignRequestSchema);
