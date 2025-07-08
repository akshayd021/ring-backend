const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const SubcategoryRoutes = require("./routes/subcategoryRoutes");
const ProductRoutes = require("./routes/productRoutes");
const OrderRputes = require("./routes/orderRoutes");
const DashborardRoutes = require("./routes/dashboardRoutes");
const CusomizeRoutes = require("./routes/customDesignRoutes");
const ContactRoutes = require("./routes/contactSectionRoutes");
const CustomeDesignReqRoutes = require("./routes/customDesignRequestRoutes");
const CartRoutes = require("./routes/cartRoutes");
const PORT = process.env.PORT || 5001;
dotenv.config();
const app = express();

// 🟢 Add this line
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/sub-category", SubcategoryRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/order", OrderRputes);
app.use("/api/dashboard", DashborardRoutes);
app.use("/api/customize", CusomizeRoutes);
app.use("/api/cotact-section", ContactRoutes);
app.use("/api/custom-design-req", CustomeDesignReqRoutes);
app.use("/api/cart", CartRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
