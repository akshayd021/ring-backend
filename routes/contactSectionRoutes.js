const express = require("express");
const router = express.Router();
const {
  createContactSection,
  getContactSection,
  updateContactSection,
  deleteContactSection,
} = require("../controllers/contactSectionController");
const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

// Admin routes
router.post("/", mustLogin, isAdmin, createContactSection);
router.put("/:id", mustLogin, isAdmin, updateContactSection);
router.delete("/:id", mustLogin, isAdmin, deleteContactSection);

// Public (frontend)
router.get("/", getContactSection);

module.exports = router;
