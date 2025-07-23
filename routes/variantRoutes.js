const express = require("express");
const router = express.Router();
const {
  createVariant,
  getAllVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
  addVariantValue,
  updateVariantValue,
  deleteVariantValue,
  deleteMultipleVariants,
  deleteVariantValues,
} = require("../controllers/variantController");
const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", mustLogin, isAdmin, createVariant); // Create
router.get("/", getAllVariants); // Read all
router.get("/:id", getVariantById); // Read one
router.put("/:id", mustLogin, isAdmin, updateVariant); // Update
router.delete("/:id", mustLogin, isAdmin, deleteVariant); // Delete
router.post("/delete-multiple", mustLogin, isAdmin, deleteMultipleVariants);

router.post("/:id/value", addVariantValue);
router.put("/value/:variantValueId", updateVariantValue);
router.delete("/value/:variantValueId", deleteVariantValue);
router.post("/delete-values", deleteVariantValues);

module.exports = router;
