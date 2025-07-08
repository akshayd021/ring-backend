const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  getOrdersByStatus,
} = require("../controllers/orderController");
const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");
const { cancelOrder } = require("../controllers/productController");

router.post("/", mustLogin, createOrder);
router.get("/", mustLogin, isAdmin, getAllOrders);
router.get("/:id", mustLogin, getOrderById);
router.get("/user/:userId", mustLogin, getOrdersByUser);
router.put("/:id/status", mustLogin, isAdmin, updateOrderStatus);
router.put("/:id/cancel", mustLogin, cancelOrder);
router.get("/status/:status", mustLogin, isAdmin, getOrdersByStatus);

module.exports = router;
