const express = require("express");
const router = express.Router();
const {
    getCustomizeSingleData,
    addCustomizeData,
    updateCustomizeData
} = require("../controllers/customizeController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.get("/:id", getCustomizeSingleData);
router.post("/", mustLogin, isAdmin, addCustomizeData);
router.put("/:id", updateCustomizeData);

module.exports = router;
