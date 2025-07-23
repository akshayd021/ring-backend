const mongoose = require("mongoose");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");

exports.addSubcategory = async (req, res) => {
  try {
    const { categoryId, name, img, desc, status } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    const subcategory = await Subcategory.create({
      name,
      img,
      desc,
      status,
      categoryId,
    });

    // Add reference to Category
    category.subcategories.push(subcategory._id);
    await category.save();

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
    const subcategories = await Subcategory.find().populate(
      "categoryId",
      "name"
    );

    const result = subcategories.map((subcat) => ({
      _id: subcat._id,
      name: subcat.name,
      img: subcat.img,
      desc: subcat.desc,
      status: subcat.status,
      categoryId: subcat.categoryId._id,
      categoryName: subcat.categoryId.name,
      createdAt: subcat.createdAt,
      updatedAt: subcat.updatedAt,
    }));

    res.status(200).json({
      status: true,
      message: "All subcategories fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid category ID",
      });
    }

    // Find all subcategories where categoryId matches
    const subcategories = await Subcategory.find({ categoryId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Subcategories fetched successfully",
      data: subcategories,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.getSubcategoryById = async (req, res) => {
  try {
    const { subCatID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subCatID)) {
      return res.status(400).json({
        status: false,
        message: "Invalid subcategory ID",
      });
    }

    const subcategory = await Subcategory.findById(subCatID).populate(
      "categoryId",
      "name"
    );

    if (!subcategory) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Subcategory fetched successfully",
      data: {
        ...subcategory.toObject(),
        categoryName: subcategory.categoryId?.name,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const { name, img, desc, status } = req.body;

    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found",
      });
    }

    if (name) subcategory.name = name;
    if (img) subcategory.img = img;
    if (desc) subcategory.desc = desc;
    if (status) subcategory.status = status;

    await subcategory.save();

    res.status(200).json({
      status: true,
      message: "Subcategory updated successfully",
      data: subcategory,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const subcategory = await Subcategory.findByIdAndDelete(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found",
      });
    }

    // Remove the reference from Category
    await Category.findByIdAndUpdate(subcategory.categoryId, {
      $pull: { subcategories: subcategory._id },
    });

    res.status(200).json({
      status: true,
      message: "Subcategory deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateMultipleSubcategoryStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    await Subcategory.updateMany({ _id: { $in: ids } }, { $set: { status } });

    res.status(200).json({
      status: true,
      message: "Subcategory statuses updated successfully",
      data: ids,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteMultipleSubcategories = async (req, res) => {
  try {
    const { ids } = req.body;

    const subcategories = await Subcategory.find({ _id: { $in: ids } });

    for (const subcat of subcategories) {
      await Category.findByIdAndUpdate(subcat.categoryId, {
        $pull: { subcategories: subcat._id },
      });
    }

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
