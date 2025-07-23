const Product = require("../models/Product");
const Order = require("../models/Order");
const slugify = require("slugify");

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
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

    const finalDiscount =
      discount || Math.round(((originalPrice - price) / originalPrice) * 100);

    const product = await Product.create({
      name,
      sku,
      category: {
        _id: category._id, // or req.body.category._id
        subcategories: category.subcategories, // must be array of ObjectIds
      },
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
  // const Subcategory = require("../models/Subcategory");
  try {
    const products = await Product.find()
      .populate("category._id")
      .populate("category.subcategories")
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
    const product = await Product.findById(req.params.id)
      .populate("category._id") // Populate main category
      .populate({
        path: "category.subcategories", // ✅ populate only selected subcategories
        model: "Subcategory",
      });

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

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
      img,
      store,
      discount:
        discount || Math.round(((originalPrice - price) / originalPrice) * 100),
      slug: slug
        ? slugify(slug, { lower: true })
        : slugify(name, { lower: true }),
    };

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
      "category variant"
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
    }).populate("category  variant");
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
      "category  variant"
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
      return res.status(400).json({
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

exports.addOrUpdateVariants = async (req, res) => {
  try {
    const { productId, att, variants } = req.body;

    let product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    product.att = att;
    product.variants = variants;
    await product.save();

    return res.json({
      status: true,
      message: "Variants saved successfully",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    return res.json({ status: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.deleteAttributeOrValue = async (req, res) => {
  try {
    const { productId } = req.params;
    const { type, attrId, valueId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    if (type === "attribute") {
      product.att.delete(attrId);
      product.variants = product.variants.filter(
        (variant) => !(attrId in variant.combination)
      );
    } else if (type === "value") {
      const values = product.att.get(attrId);
      if (Array.isArray(values)) {
        product.att.set(
          attrId,
          values.filter((v) => v !== valueId)
        );
      }

      product.variants = product.variants.filter(
        (variant) => variant.combination[attrId] !== valueId
      );
    }

    await product.save();
    res.json({ status: true, message: "Deleted successfully", data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
