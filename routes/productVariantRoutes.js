const express = require("express");
const {
  createProductVariant,
  linkTempVariantsToProduct,
  deleteProductVariant,
  updateProductVariant,
  getVariantsByProductId,
} = require("../controllers/productVariantController");
const router = express.Router();

router.post("/", createProductVariant);
router.put("/update-by-temp", linkTempVariantsToProduct);
router.get("/product/:productId", getVariantsByProductId);
router.put("/:id", updateProductVariant);
router.delete("/:id", deleteProductVariant);
module.exports = router;
