const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
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
} = require("../controllers/productController");

router.post("/", mustLogin, isAdmin, addProduct);
router.get("/", mustLogin, isAdmin, getAllProducts);
router.get("/store", getProductsInStore);
router.get("/active", getActiveProducts);
router.get("/:id", mustLogin, isAdmin, getProductById);
router.put("/:id", mustLogin, isAdmin,  updateProduct);
router.delete("/:id", mustLogin, isAdmin, deleteProduct);
router.get("/slug/:slug", getProductBySlug);

router.put(
  "/update/status/many",
  mustLogin,
  isAdmin,
  updateMultipleProductStatus
);
router.post("/delete/many", mustLogin, isAdmin, deleteMultipleProducts);

module.exports = router;
