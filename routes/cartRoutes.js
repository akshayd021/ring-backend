const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/CartController");

const { mustLogin } = require("../middlewares/authMiddleware");

router.post("/add", mustLogin, addToCart);
router.get("/", mustLogin, getCart);
router.put("/update", mustLogin, updateCartItem);
router.delete("/remove", mustLogin, removeCartItem);

module.exports = router;
