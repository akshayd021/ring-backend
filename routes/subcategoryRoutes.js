const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  addSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
  updateMultipleSubcategoryStatus,
  deleteMultipleSubcategories,
  getSubcategoriesByCategoryId,
} = require("../controllers/subcategoryController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", mustLogin, isAdmin, addSubcategory);
router.get("/",  getAllSubcategories);
router.get("/:subCatID", getSubcategoryById);
router.get("/category/:categoryId", getSubcategoriesByCategoryId);
router.put("/:subcategoryId", mustLogin, isAdmin, updateSubcategory);
router.delete("/:subcategoryId", mustLogin, isAdmin, deleteSubcategory);
router.put(
  "/update/status/many",
  mustLogin,
  isAdmin,
  updateMultipleSubcategoryStatus
);
router.post("/delete/many", mustLogin, isAdmin, deleteMultipleSubcategories);

module.exports = router;
