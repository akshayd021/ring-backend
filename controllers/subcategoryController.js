const Subcategory = require("../models/Subcategory");

exports.addSubcategory = async (req, res) => {
  try {
    const { name, desc, status, categoryId } = req.body;
    const img = req.file?.path || "";

    const subcategory = await Subcategory.create({
      name,
      img,
      desc,
      status,
      categoryId,
    });

    res.status(201).json({
      status: true,
      message: "Subcategory created successfully",
      data: subcategory,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "All subcategories fetched successfully",
      data: subcategories,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate(
      "categoryId"
    );

    if (!subcategory)
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });

    res.status(200).json({
      status: true,
      message: "Subcategory fetched successfully",
      data: subcategory,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { name, desc, status, categoryId } = req.body;
    const img = req.file?.path;

    const updatedData = { name, desc, status, categoryId };
    if (img) updatedData.img = img;

    const updated = await Subcategory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updated)
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });

    res.status(200).json({
      status: true,
      message: "Subcategory updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Subcategory not found" });

    res.status(200).json({
      status: true,
      message: "Subcategory deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateMultipleStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    await Subcategory.updateMany({ _id: { $in: ids } }, { $set: { status } });

    res.status(200).json({
      status: true,
      message: "Subcategory statuses updated successfully",
      data: { ids, status },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteMultipleSubcategories = async (req, res) => {
  try {
    const { ids } = req.body;

    await Subcategory.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: true,
      message: "Subcategories deleted successfully",
      data: ids,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
