const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      otp,
    });

    await sendEmail(
      email,
      "Verify your email",
      `<p>Your verification code is: <strong>${otp}</strong></p>`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email for verification",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    console.log("tet");
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    console.log(user, "user");
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      token,
      message: "Email verified and logged in",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail(
      email,
      "Resend Verification Code",
      `<p>Your new verification code is: <strong>${otp}</strong></p>`
    );

    res
      .status(200)
      .json({ success: true, message: "OTP resent to your email" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before login",
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      success: true,
      token,
      user,
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  console.log("forget called");
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail(
      email,
      "Reset Password Code",
      `<p>Your reset code is: <strong>${otp}</strong></p>`
    );

    res.status(200).json({
      success: true,
      message: "Reset code sent to your mail",
      otp: otp,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    console.log(user, "user");
    if (!user || user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: req.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.addresses.length >= 5) {
      return res
        .status(400)
        .json({ success: false, message: "Max 5 addresses allowed" });
    }

    const newAddress = req.body;

    // If user sets isDefault true, unset others
    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address added successfully",
      data: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and New password can not be same",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updatedAddress = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const index = user.addresses.findIndex((a) => a._id.toString() === addressId);
    if (index === -1)
      return res.status(404).json({ success: false, message: "Address not found" });

    // If setting default, clear all others first
    if (updatedAddress.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    // Update fields
    user.addresses[index] = { ...user.addresses[index]._doc, ...updatedAddress };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.addresses = user.addresses.filter((a) => a._id.toString() !== addressId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};