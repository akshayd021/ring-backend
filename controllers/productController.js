const Product = require("../models/Product");
const Order = require("../models/Order");
const slugify = require("slugify");

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      subcategory,
      img,
      size,
      variant,
      desc1,
      desc2,
      desc3,
      status,
      tag,
      slug,
      price,
      originalPrice,
      discount,
      stock,
      store,
      bestseller,
    } = req.body;

    // Optional: auto calculate discount if not provided
    const finalDiscount =
      discount || Math.round(((originalPrice - price) / originalPrice) * 100);

    const product = await Product.create({
      name,
      sku,
      category,
      subcategory,
      img,
      size,
      variant,
      desc1,
      desc2,
      desc3,
      status,
      tag,
      slug,
      price,
      originalPrice,
      discount: finalDiscount,
      stock,
      store,
      bestseller,
    });

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category subcategory")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "All products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category subcategory"
    );
    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      subcategory,
      size,
      variant,
      desc1,
      desc2,
      desc3,
      status,
      tag,
      slug,
      price,
      originalPrice,
      discount,
      stock,
      img,
      store,
    } = req.body;


    const updatedData = {
      name,
      sku,
      category,
      subcategory,
      size,
      variant,
      desc1,
      desc2,
      desc3,
      status,
      tag,
      price,
      originalPrice,
      stock,
      store,
      discount:
        discount || Math.round(((originalPrice - price) / originalPrice) * 100),
      slug: slug
        ? slugify(slug, { lower: true })
        : slugify(name, { lower: true }),
    };
    if (img?.length) updatedData.img = images;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category subcategory"
    );
    if (!product)
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });

    res.status(200).json({
      status: true,
      message: "Product fetched by slug successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getProductsInStore = async (req, res) => {
  try {
    const products = await Product.find({
      store: true,
      status: "active",
    }).populate("category subcategory");
    res.status(200).json({
      status: true,
      message: "Store products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" }).populate(
      "category subcategory"
    );
    res.status(200).json({
      status: true,
      message: "Active products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateMultipleProductStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    await Product.updateMany({ _id: { $in: ids } }, { $set: { status } });

    res.status(200).json({
      status: true,
      message: "Product statuses updated successfully",
      data: { ids, status },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: true,
      message: "Products deleted successfully",
      data: ids,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    }

    if (order.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized to cancel this order" });
    }

    if (order.status === "cancel" || order.status === "delivered") {
      return res
        .status(400)
        .json({
          status: false,
          message: `Cannot cancel an already ${order.status} order`,
        });
    }

    order.status = "cancel";
    await order.save();

    res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
