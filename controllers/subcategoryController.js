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

    const newSubcategory = {
      name,
      img,
      desc,
      status,
    };

    category.subcategories.push(newSubcategory);
    await category.save();

    res.status(201).json({
      status: true,
      message: "Subcategory added successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllSubcategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // Flatten all subcategories with category reference
    const allSubcategories = categories.flatMap((category) =>
      category.subcategories.map((subcat) => ({
        ...subcat.toObject(),
        categoryId: category._id,
        categoryName: category.name,
      }))
    );

    res.status(200).json({
      status: true,
      message: "All subcategories fetched successfully",
      data: allSubcategories,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getSubcategoryById = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const category = await Category.findOne({
      "subcategories._id": subcategoryId,
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found",
      });
    }

    const subcategory = category.subcategories.id(subcategoryId);

    res.status(200).json({
      status: true,
      message: "Subcategory fetched successfully",
      data: { ...subcategory.toObject(), categoryId: category._id },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const { name, img, desc, status } = req.body;

    const category = await Category.findOne({
      "subcategories._id": subcategoryId,
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found",
      });
    }

    const subcategory = category.subcategories.id(subcategoryId);
    subcategory.name = name || subcategory.name;
    subcategory.img = img || subcategory.img;
    subcategory.desc = desc || subcategory.desc;
    subcategory.status = status || subcategory.status;

    await category.save();

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

    const category = await Category.findOne({
      "subcategories._id": subcategoryId,
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Subcategory not found",
      });
    }

    category.subcategories.id(subcategoryId).remove();
    await category.save();

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

    const categories = await Category.find({
      "subcategories._id": { $in: ids },
    });

    for (const category of categories) {
      for (const subcat of category.subcategories) {
        if (ids.includes(subcat._id.toString())) {
          subcat.status = status;
        }
      }
      await category.save();
    }

    res.status(200).json({
      status: true,
      message: "Subcategory statuses updated successfully",
      data: ids,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✅ Delete Multiple Subcategories
exports.deleteMultipleSubcategories = async (req, res) => {
  try {
    const { ids } = req.body;

    const categories = await Category.find({
      "subcategories._id": { $in: ids },
    });

    for (const category of categories) {
      category.subcategories = category.subcategories.filter(
        (subcat) => !ids.includes(subcat._id.toString())
      );
      await category.save();
    }

    res.status(200).json({
      status: true,
      message: "Subcategories deleted successfully",
      data: ids,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
