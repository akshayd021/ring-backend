const Variant = require("../models/Variant");

// CREATE
exports.createVariant = async (req, res) => {
  try {
    const variant = await Variant.create(req.body);
    res.status(201).json({ status: true, message: "Variant created", data: variant });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// READ ALL
exports.getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.find();
    res.json({ status: true, data: variants });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// READ SINGLE
exports.getVariantById = async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id);
    if (!variant) return res.status(404).json({ status: false, message: "Variant not found" });

    res.json({ status: true, data: variant });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!variant) return res.status(404).json({ status: false, message: "Variant not found" });

    res.json({ status: true, message: "Variant updated", data: variant });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndDelete(req.params.id);
    if (!variant) return res.status(404).json({ status: false, message: "Variant not found" });

    res.json({ status: true, message: "Variant deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
