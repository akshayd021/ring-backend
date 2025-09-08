const Customize = require("../models/Customize");
const Product = require("../models/Product");

exports.setTopSellers = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length !== 5) {
      return res.status(400).json({
        status: false,
        message: "You must provide exactly 5 product IDs.",
      });
    }

    // Clear existing top sellers
    await Customize.deleteMany({});

    // Set new top sellers
    const customizeDocs = await Customize.insertMany(
      productIds.map((id) => ({ product: id }))
    );

    // Optionally update the `bestseller` field on the Product model
    await Product.updateMany({}, { $set: { bestseller: false } });
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { bestseller: true } }
    );

    res.status(200).json({
      status: true,
      message: "Top seller products updated successfully.",
      data: customizeDocs,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getTopSellers = async (req, res) => {
  try {
    const customize = await Customize.find().populate({
      path: "product",
      populate: [
        { path: "category._id", model: "Category" },
        { path: "category.subcategories", model: "Subcategory" },
      ],
    });

    if (!customize) {
      return res
        .status(404)
        .json({ status: false, message: "No top sellers found" });
    }

    res.status(200).json({
      status: true,
      data: customize,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
