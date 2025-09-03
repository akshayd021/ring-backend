const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, size, variant, diamond } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, size, variant, diamond }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) =>
          item.productId?.toString() === productId &&
          item.size === size &&
          item.variant === variant &&
          JSON.stringify(item.diamond) === JSON.stringify(diamond) // compare diamonds
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, size, variant, diamond });
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
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );

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
    const { productId, quantity, size, variant } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.variant === variant
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
    const { productId, size, variant } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId ||
        item.size !== size ||
        item.variant !== variant
    );

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
  console.log(userId, "id");
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
