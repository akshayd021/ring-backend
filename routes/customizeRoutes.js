const express = require("express");
const router = express.Router();
const {
  getCustomizeSingleData,
  addCustomizeData,
  updateCustomizeData,
  setTopSellers,
  getTopSellers,
} = require("../controllers/customizeController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", getTopSellers);
router.post("/", mustLogin, isAdmin, setTopSellers);
// router.put("/:id", updateCustomizeData);

module.exports = router;
