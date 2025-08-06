const express = require("express");
const router = express.Router();
const {
    getCustomizeSingleData,
    addCustomizeData
} = require("../controllers/customizeController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.get("/:id", getCustomizeSingleData);
router.post("/", mustLogin, isAdmin, addCustomizeData);

module.exports = router;
