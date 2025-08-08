const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");

exports.addCategory = async (req, res) => {
  try {
    const { name, desc, status, img } = req.body;

    const category = await Category.create({ name, img, desc, status });

    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "All categories fetched successfully",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate({
      path: "subcategories",
      model: "Subcategory",
    });

    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    res.status(200).json({
      status: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, desc, img, status } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    category.name = name;
    category.desc = desc;
    category.status = status;
    category.img = img || category.img;

    await category.save();

    res.json({ status: true, message: "Category updated", data: category });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

// ✅ Delete Single Category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });

    res.status(200).json({
      status: true,
      message: "Category deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✅ Update Status of Multiple Categories
exports.updateMultipleStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    await Category.updateMany({ _id: { $in: ids } }, { $set: { status } });

    res.status(200).json({
      status: true,
      message: "Category statuses updated successfully",
      data: { ids, status },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✅ Delete Multiple Categories
exports.deleteMultipleCategories = async (req, res) => {
  try {
    const { ids } = req.body;

    await Category.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: true,
      message: "Categories deleted successfully",
      data: ids,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
