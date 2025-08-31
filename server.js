import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/routes.js";
import productRoutes from "./routes/product.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

const MONGO_URI = "mongodb+srv://raghavvohra375_db_user:Sz242ajTGAHkOQ5u@cluster0.0wsvotq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
