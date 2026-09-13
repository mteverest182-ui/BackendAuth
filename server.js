import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import bannerRoutes from "./routes/banner.routes.js";
import orderRoutes from "./routes/order.routes.js"

const app = express();

const allowedOrigins = [
  "https://admin-dash-six-theta.vercel.app",
  "https://ecommercelux.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/dashboard", dashboardRoutes, orderRoutes);


app.listen(port, () => {
  console.log(`server sedang berjalan di port ${port}`);
});
