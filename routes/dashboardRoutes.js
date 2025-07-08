const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getSalesOverviewChart,
  getBestSellers,
} = require("../controllers/dashboardController");
const { mustLogin, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", mustLogin, isAdmin, getDashboardStats);
router.get("/sales-chart", mustLogin, isAdmin, getSalesOverviewChart);
router.get("/best-sellers", mustLogin, isAdmin, getBestSellers);

module.exports = router;
