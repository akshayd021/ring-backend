const express = require("express");
const router = express.Router();
const {
  createCustomDesignRequest,
  getAllCustomDesignRequests,
  getCustomDesignRequest,
  updateCustomDesignRequest,
  deleteCustomDesignRequest,
} = require("../controllers/customDesignRequestController");

const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

// Public
router.post("/", createCustomDesignRequest);

// Admin
router.get("/", mustLogin, isAdmin, getAllCustomDesignRequests);
router.get("/:id", mustLogin, isAdmin, getCustomDesignRequest);
router.put("/:id", mustLogin, isAdmin, updateCustomDesignRequest);
router.delete("/:id", mustLogin, isAdmin, deleteCustomDesignRequest);

module.exports = router;
