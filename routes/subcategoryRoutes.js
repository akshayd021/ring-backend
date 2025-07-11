const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  addSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
  updateMultipleStatus,
  deleteMultipleSubcategories,
} = require("../controllers/subcategoryController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", mustLogin, isAdmin, addSubcategory);
router.get("/", mustLogin, isAdmin, getAllSubcategories);
router.get("/:id", mustLogin, isAdmin, getSubcategoryById);
router.put("/:id", mustLogin, isAdmin, updateSubcategory);
router.delete("/:id", mustLogin, isAdmin, deleteSubcategory);
router.put("/update/status/many", mustLogin, isAdmin, updateMultipleStatus);
router.post("/delete/many", mustLogin, isAdmin, deleteMultipleSubcategories);

module.exports = router;
