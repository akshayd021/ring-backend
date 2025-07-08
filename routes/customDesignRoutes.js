const express = require("express");
const router = express.Router();
const {
  addCustomDesign,
  getAllCustomDesigns,
  getCustomDesign,
  updateCustomDesign,
  deleteCustomDesign,
  updateManyCustomDesignStatus,
} = require("../controllers/customDesignController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", mustLogin, isAdmin, addCustomDesign);
router.get("/", getAllCustomDesigns);
router.get("/:id", getCustomDesign);
router.put("/:id", mustLogin, isAdmin, updateCustomDesign);
router.delete("/:id", mustLogin, isAdmin, deleteCustomDesign);
router.patch(
  "/update-status",
  mustLogin,
  isAdmin,
  updateManyCustomDesignStatus
);

module.exports = router;
