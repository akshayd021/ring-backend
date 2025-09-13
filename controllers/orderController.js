const Order = require("../models/Order");
const fs = require("fs");
const path = require("path");
const { generateInvoice } = require("../utils/invoice");
const sendEmail = require("../utils/sendEmail");
const Subcategory = require("../models/Subcategory");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      address,
      products,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      cardInfo,
    } = req.body;

    const orderProducts = [];

    for (let p of products) {
      const productDoc = await Product.findById(p.product);

      if (!productDoc) {
        return res
          .status(404)
          .json({ status: false, message: `Product not found: ${p.product}` });
      }

      let selectedVariant = null;

      if (p.variantId) {
        selectedVariant = productDoc.variants.id(p.variantId); // ✅ find by _id inside variants array
        if (!selectedVariant) {
          return res.status(400).json({
            status: false,
            message: `Variant not found for product ${productDoc.name}`,
          });
        }
      }

      orderProducts.push({
        product: p.product,
        variantId: p.variantId || null, // ✅ store variantId
        quantity: p.quantity,
        price: p.price,
        size: p.size || null,
        variant: p.variant || null,
        diamond: p.diamond || null,
      });
    }

    const order = await Order.create({
      userId,
      address,
      products: orderProducts,
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
      data: populatedOrder,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate({
        path: "products.product",
        populate: [
          { path: "category._id", model: "Category" },
          { path: "category.subcategories", model: "Subcategory" },
        ],
      });

    // ✅ Attach variant details manually
    orders = orders.map((order) => {
      order = order.toObject();
      order.products = order.products.map((p) => {
        if (p.variantId && p.product?.variants) {
          const variant = p.product.variants.find(
            (v) => v._id.toString() === p.variantId.toString()
          );
          return { ...p, variantDetails: variant || null };
        }
        return { ...p, variantDetails: null };
      });
      return order;
    });

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
    let order = await Order.findById(req.params.id)
      .populate("userId")
      .populate({
        path: "products.product",
        populate: [
          { path: "category._id", model: "Category" },
          { path: "category.subcategories", model: "Subcategory" },
        ],
      });

    if (!order)
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });

    // ✅ Attach variant details manually
    order = order.toObject();
    order.products = order.products.map((p) => {
      if (p.variantId && p.product?.variants) {
        const variant = p.product.variants.find(
          (v) => v._id.toString() === p.variantId.toString()
        );
        return { ...p, variantDetails: variant || null };
      }
      return { ...p, variantDetails: null };
    });

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
    let orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate({
        path: "products.product",
        populate: [
          { path: "category._id", model: "Category" },
          { path: "category.subcategories", model: "Subcategory" },
        ],
      });

    // ✅ Attach variant details manually
    orders = orders.map((order) => {
      order = order.toObject();
      order.products = order.products.map((p) => {
        if (p.variantId && p.product?.variants) {
          const variant = p.product.variants.find(
            (v) => v._id.toString() === p.variantId.toString()
          );
          return { ...p, variantDetails: variant || null };
        }
        return { ...p, variantDetails: null };
      });
      return order;
    });

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
    const orders = await Order.find({ status })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate({
        path: "products.product",
        populate: [
          {
            path: "category._id",
            model: "Category",
          },
          {
            path: "category.subcategories",
            model: "Subcategory",
          },
        ],
      });

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

exports.deleteAllOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await Order.deleteMany({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      status: true,
      message: `${result.deletedCount} All Order Deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
