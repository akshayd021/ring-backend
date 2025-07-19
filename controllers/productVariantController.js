const ProductVariant = require("../models/ProductVariant");

exports.createProductVariant = async (req, res) => {
  try {
    const data = req.body; // Can contain tempId or productId

    const newVariant = await ProductVariant.create(data);

    res.status(201).json({
      status: true,
      message: "Product Variant Created",
      data: newVariant,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.linkTempVariantsToProduct = async (req, res) => {
  try {
    const { tempId, productId } = req.body;

    if (!tempId || !productId) {
      return res.status(400).json({ status: false, message: "Missing tempId or productId" });
    }

    const result = await ProductVariant.updateMany(
      { tempId },
      { $set: { productId }, $unset: { tempId: 1 } }
    );

    res.json({
      status: true,
      message: `Linked ${result.modifiedCount} variants to product`,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getVariantsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const variants = await ProductVariant.find({ productId });

    res.json({
      status: true,
      data: variants,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!variant) {
      return res.status(404).json({ status: false, message: "Variant not found" });
    }

    res.json({
      status: true,
      message: "Variant updated successfully",
      data: variant,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

exports.deleteProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndDelete(req.params.id);

    if (!variant) {
      return res.status(404).json({ status: false, message: "Variant not found" });
    }

    res.json({
      status: true,
      message: "Variant deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};