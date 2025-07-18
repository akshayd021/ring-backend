const Order = require("../models/Order");
const fs = require("fs");
const path = require("path");
const { generateInvoice } = require("../utils/invoice");
const sendEmail = require("../utils/sendEmail");

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      products,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      cardInfo,
    } = req.body;

    const order = await Order.create({
      userId,
      products,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      cardInfo,
    });

    const populatedOrder = await Order.findById(order._id).populate(
      "products.product userId"
    );


    const filename = `invoices/invoice_${order._id}.pdf`;
    await generateInvoice(populatedOrder, filename);

    if (populatedOrder?.userId?.email) {
      await sendEmail(
        populatedOrder.userId.email,
        "Your Order Invoice",
        `Thank you ${
          populatedOrder.userId.name || "Customer"
        }, please find your invoice attached.`,
        filename
      );
    }

    fs.unlinkSync(path.resolve(filename));

    
    res.status(201).json({
      status: true,
      message: "Order placed and invoice emailed successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId products.product");
    res.status(200).json({
      status: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId products.product"
    );
    if (!order)
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });

    res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate(
      "products.product"
    );
    res.status(200).json({
      status: true,
      message: "User orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });

    res.status(200).json({
      status: true,
      message: "Order status updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const orders = await Order.find({ status }).populate(
      "userId products.product"
    );
    res.status(200).json({
      status: true,
      message: `${status} orders fetched successfully`,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteMultipleOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No order IDs provided" });
    }

    const result = await Order.deleteMany({ _id: { $in: orderIds } });

    res.status(200).json({
      status: true,
      message: `${result.deletedCount} orders deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
