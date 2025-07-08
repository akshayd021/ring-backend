const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateMultipleStatus,
  deleteMultipleCategories,
} = require("../controllers/categoryController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

// 🛡 Protected Admin Routes
router.post("/", mustLogin, isAdmin, upload.single("img"), addCategory);
router.get("/", mustLogin, isAdmin, getAllCategories);
router.get("/:id", mustLogin, isAdmin, getCategoryById);
router.put("/:id", mustLogin, isAdmin, upload.single("img"), updateCategory);
router.delete("/:id", mustLogin, isAdmin, deleteCategory);
router.put("/update/status/many", mustLogin, isAdmin, updateMultipleStatus);
router.post("/delete/many", mustLogin, isAdmin, deleteMultipleCategories);

module.exports = router;
