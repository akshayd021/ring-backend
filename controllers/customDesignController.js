const CustomDesign = require("../models/CustomDesign");

// ➕ Add new design
exports.addCustomDesign = async (req, res) => {
  try {
    const design = await CustomDesign.create(req.body);
    res.status(201).json({
      status: true,
      message: "Custom design created successfully",
      data: design,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create custom design",
      error: err.message,
    });
  }
};

// 📥 Get all designs
exports.getAllCustomDesigns = async (req, res) => {
  try {
    const designs = await CustomDesign.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "Custom designs fetched successfully",
      data: designs,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch custom designs",
      error: err.message,
    });
  }
};

// 📍 Get single design
exports.getCustomDesign = async (req, res) => {
  try {
    const design = await CustomDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({
        status: false,
        message: "Custom design not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Custom design fetched successfully",
      data: design,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch custom design",
      error: err.message,
    });
  }
};

// ✏️ Update design
exports.updateCustomDesign = async (req, res) => {
  try {
    const updated = await CustomDesign.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Custom design not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Custom design updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update custom design",
      error: err.message,
    });
  }
};

// ❌ Delete design
exports.deleteCustomDesign = async (req, res) => {
  try {
    const deleted = await CustomDesign.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Custom design not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Custom design deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete custom design",
      error: err.message,
    });
  }
};

// 🔄 Update multiple design statuses
exports.updateManyCustomDesignStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please provide an array of IDs",
      });
    }

    const result = await CustomDesign.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    res.status(200).json({
      status: true,
      message: "Custom design statuses updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update design statuses",
      error: err.message,
    });
  }
};
