const express = require("express");
const router = express.Router();
const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getProductsInStore,
  getActiveProducts,
  updateMultipleProductStatus,
  deleteMultipleProducts,
  addOrUpdateVariants,
  getProduct,
  deleteAttributeOrValue,
} = require("../controllers/productController");

router.post("/", mustLogin, isAdmin, addProduct);
router.get("/", mustLogin, getAllProducts);
router.get("/store", getProductsInStore);
router.get("/active", getActiveProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", mustLogin, isAdmin, getProductById);
router.put("/:id", mustLogin, isAdmin, updateProduct);
router.delete("/:id", mustLogin, isAdmin, deleteProduct);

router.post("/variant", mustLogin, addOrUpdateVariants);

router.get("/:id", mustLogin, getProduct);

router.delete("/:productId/variant", mustLogin, deleteAttributeOrValue);

router.put(
  "/update/status/many",
  mustLogin,
  isAdmin,
  updateMultipleProductStatus
);
router.post("/delete/many", mustLogin, isAdmin, deleteMultipleProducts);

module.exports = router;
