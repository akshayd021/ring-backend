const moment = require("moment");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getDashboardStats = async (req, res) => {
  try {
    let { from, to, month, year } = req.query;

    let startDate, endDate;
    if (month && year) {
      startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
      endDate = moment(startDate).endOf("month").toDate();
    } else if (from && to) {
      startDate = new Date(from);
      endDate = new Date(to);
    } else {
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
    }

    const dateFilter = { createdAt: { $gte: startDate, $lte: endDate } };

    // 1. Total Revenue
    const totalRevenueData = await Order.aggregate([
      { $match: { ...dateFilter, status: { $ne: "cancel" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    // 2. Sales by Category
    const salesByCategory = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },

      // Extract nested category._id to top level
      {
        $addFields: {
          categoryId: "$productInfo.category._id",
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: {
            _id: "$categoryInfo._id",
            name: "$categoryInfo.name",
          },
          totalSales: { $sum: "$products.quantity" },
          revenue: { $sum: "$products.price" },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);
    // 3. Overview
    const salesOverview = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const overviewData = { pending: 0, processing: 0, delivered: 0, cancel: 0 };
    salesOverview.forEach((s) => (overviewData[s._id] = s.count));

    const recentOrders = await Order.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "email firstname lastname")

      .populate("products.product", "img name");

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select("name stock img category")
      .lean();

    const categoryIds = lowStockProducts
      .map((p) => p.category?._id)
      .filter(Boolean);

    const categories = await Category.find({
      _id: { $in: categoryIds },
    }).select("name");

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id.toString()] = cat.name;
    });

    const result = lowStockProducts.map((p) => ({
      productName: p.name,
      productImg: p.img?.[0] || null,
      stock: p.stock,
      categoryName: categoryMap[p.category?._id?.toString()] || "N/A",
    }));

    res.status(200).json({
      status: true,
      message: "Dashboard data fetched successfully",
      data: {
        filterRange: { from: startDate, to: endDate },
        totalRevenue,
        salesByCategory,
        overview: overviewData,
        recentOrders,
        lowStockProducts: result,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getSalesOverviewChart = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const monthlyData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`),
          },
          status: { $ne: "cancel" },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const chartData = Array.from({ length: 12 }, (_, i) => {
      const found = monthlyData.find((m) => m._id.month === i + 1);
      return {
        month: moment().month(i).format("MMM"),
        total: found ? found.total : 0,
        orders: found ? found.orders : 0,
      };
    });

    res.status(200).json({
      status: true,
      message: `Monthly sales overview for ${year}`,
      data: chartData,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const bestSellers = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: { $sum: "$products.price" },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          img: "$product.img",
          slug: "$product.slug",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json({
      status: true,
      message: "Best selling products fetched successfully",
      data: bestSellers,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
