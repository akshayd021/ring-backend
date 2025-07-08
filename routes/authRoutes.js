const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  login,
  resendOtp,
  forgotPassword,
  resetPassword,
  getMe,
  getAllUsers,
  addAddress,
  changePassword,
  deleteAddress,
  updateAddress,
} = require("../controllers/authController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", mustLogin, changePassword);

// router.get('/get-me', getMe)
router.get("/me", mustLogin, getMe);
router.get("/users", mustLogin, isAdmin, getAllUsers);
router.post("/add-address", mustLogin, addAddress);
router.put("/update-address/:addressId", mustLogin, updateAddress);
router.delete("/delete-address/:addressId", mustLogin, deleteAddress);
module.exports = router;
