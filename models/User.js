const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "admin" },
    otp: { type: String },
    isVerified: { type: Boolean, default: false },
    mobileNumber: { type: String, required: false },
    // countryCode: { type: String, required: false },
    // profilePicture: { type: String, default: "" },
    addresses: [
      {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
