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
const VariantRoutes = require("./routes/variantRoutes");
const contactRoutes = require("./routes/contactRoutes");
const customizeRoutes = require("./routes/customizeRoutes");

const PORT = process.env.PORT || 5001;
dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://ring-frontend-xi.vercel.app",
  "https://yourfrontenddomain.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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
// app.use("/api/customize", CusomizeRoutes);
app.use("/api/cotact-section", ContactRoutes);
app.use("/api/custom-design-req", CustomeDesignReqRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/variant", VariantRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/customize", customizeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
