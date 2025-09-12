const Cart = require("../models/Cart");
const Variant = require("../models/Variant");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, size, variant, diamond, variantId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, size, variant, diamond, variantId }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) =>
          item.productId?.toString() === productId &&
          item.size === size &&
          item.variant === variant &&
          item.variantId === variantId &&
          JSON.stringify(item.diamond) === JSON.stringify(diamond)
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          size,
          variant,
          diamond,
          variantId,
        }); // ✅ add variantId here too
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: "items.productId",
      populate: [
        {
          path: "category._id",
          model: "Category",
        },
        {
          path: "category.subcategories",
          model: "Subcategory",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart || { items: [] },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, size, variant, variantId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.variant === variant &&
        item.variantId === variantId
    );

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    cart.items[index].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.body; // 👈 pass the cart item _id from frontend

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // filter out the item
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAllCarts = async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await Cart.deleteMany({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "No Data found for this user",
      });
    }

    res.status(200).json({
      status: true,
      message: `All Data Deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
