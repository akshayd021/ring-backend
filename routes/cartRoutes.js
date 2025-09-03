const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  deleteAllCarts,
} = require("../controllers/cartController");

const { mustLogin } = require("../middlewares/authMiddleware");

router.post("/add", mustLogin, addToCart);
router.get("/", mustLogin, getCart);
router.put("/update", mustLogin, updateCartItem);
router.delete("/remove/:id", mustLogin, removeCartItem);
router.delete("/delete", mustLogin, deleteAllCarts);

module.exports = router;
