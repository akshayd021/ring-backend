const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const { isAdmin, mustLogin } = require("../middlewares/authMiddleware");

router.post("/", createContact);
router.get("/", mustLogin, isAdmin, getAllContacts); // Read all
router.get("/:id", mustLogin, isAdmin, getContactById); // Read one
router.put("/:id", mustLogin, isAdmin, updateContact); // Update
router.delete("/:id", mustLogin, isAdmin, deleteContact); // Delete

module.exports = router;
