import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/routes.js";
import productRoutes from "./routes/product.js";
import checkoutRoutes from "./routes/checkout.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import { requestLogger, getRecentLogs } from "./middleware/requestLogger.js";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(requestLogger);

const MONGO_URI =
  "mongodb+srv://raghavvohra375_db_user:Sz242ajTGAHkOQ5u@cluster0.0wsvotq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

import { User } from "./models/models.js";
const adminEnv = process.env.ADMIN_EMAILS;
if (adminEnv) {
  const list = adminEnv.split(",").map((s) => s.trim()).filter(Boolean);
  list.forEach(async (email) => {
    try {
      const u = await User.findOne({ email });
      if (u && !u.isAdmin) {
        u.isAdmin = true;
        await u.save();
      }
    } catch (e) {
      console.error("Error setting admin:", e.message);
    }
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.get("/logs/recent", (req, res) => {
  const logs = getRecentLogs(50);
  res.json(logs);
});
const ROLLNO = process.env.ROLLNO || "000000";
app.get(`/${ROLLNO}/healthz`, (req, res) =>
  res.json({ status: "ok", ts: new Date().toISOString() })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
