const Cart = require("../models/Cart");
const Variant = require("../models/Variant");

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
    const variantDefs = await Variant.find({ status: "show" });
    const valueIdToTextMap = {};
    variantDefs.forEach((variantDef) => {
      variantDef.variants.forEach((v) => {
        valueIdToTextMap[v._id.toString()] = v.value;
      });
    });

    const updatedCart = cart.items.map((item) => {
      // Find the product variant that matches this cart item (if product has variants)
      const productVariant = item.productId?.variants?.find(
        (v) => v._id === item.variant // compare with stored variant in cart
      );

      let updatedCombinationString = null;

      if (productVariant?.combinationString) {
        const ids = productVariant.combinationString.split(" / ");
        const readableValues = ids.map((id) => valueIdToTextMap[id] || id);
        updatedCombinationString = readableValues.join(" / ");
      }

      return {
        ...item._doc,
        product: item.productId,
        combinationString: updatedCombinationString,
      };
    });
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: updatedCart || { items: [] },
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
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
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
