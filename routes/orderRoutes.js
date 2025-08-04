const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  getOrdersByStatus,
  deleteOrder,
  deleteMultipleOrders,
} = require("../controllers/orderController");
const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");
const { cancelOrder } = require("../controllers/productController");

router.post("/", mustLogin, createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.get("/user/:userId", mustLogin, getOrdersByUser);
router.put("/:id/status", mustLogin, isAdmin, updateOrderStatus);
router.put("/:id/cancel", mustLogin, cancelOrder);
router.get("/status/:status", mustLogin, isAdmin, getOrdersByStatus);
router.delete("/:id", mustLogin, isAdmin, deleteOrder);
router.post("/delete-multiple", mustLogin, isAdmin, deleteMultipleOrders);

module.exports = router;
