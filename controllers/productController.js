const Product = require("../models/Product");
const Order = require("../models/Order");
const Variant = require("../models/Variant");
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
      variantsEnabled,
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
      variantsEnabled,
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
      .populate("category._id")
      .populate("category.subcategories");

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    // Fetch all variant definitions
    const variantDefs = await Variant.find({ status: "show" });

    // Create a map: valueId -> valueText
    const valueIdToTextMap = {};
    variantDefs.forEach((variantDef) => {
      variantDef.variants.forEach((v) => {
        valueIdToTextMap[v._id.toString()] = v.value;
      });
    });

    // Update each variant's combinationString
    const updatedVariants = product.variants.map((variant) => {
      const ids = variant.combinationString.split(" / ");
      const readableValues = ids.map((id) => valueIdToTextMap[id] || id);
      const updatedCombinationString = readableValues.join(" / ");
      return {
        ...variant._doc,
        combinationString: updatedCombinationString,
      };
    });

    // Replace the original variants array
    const updatedProduct = {
      ...product._doc,
      variants: updatedVariants,
    };

    res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: updatedProduct,
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
      bestseller,
      variantsEnabled,
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
      variantsEnabled,
      bestseller,
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

    if (!productId || !Array.isArray(variants) || typeof att !== "object") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid payload" });
    }

    const cleanVariants = variants
      .map((v) => {
        if (
          !v.combination ||
          typeof v.combination !== "object" ||
          Array.isArray(v.combination)
        )
          return null;

        return {
          combination: v.combination,
          combinationString: Object.entries(v.combination)
            .map(([attrId, valueId]) => valueId)
            .join(" / "),
          price: v.price || 0,
          salePrice: v.salePrice || 0,
          sku: v.sku || "",
          barcode: v.barcode || "",
          quantity: v.quantity || 0,
          img: Array.isArray(v.img) ? v.img : [],
        };
      })
      .filter(Boolean);

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    product.att = att;
    product.variants = cleanVariants;
    await product.save();

    res.json({ status: true, message: "Variants updated", data: product });
  } catch (err) {
    console.error("Error updating variants:", err);
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
