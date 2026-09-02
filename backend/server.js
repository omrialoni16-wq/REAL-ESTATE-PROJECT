import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/AuthRoutes.js";
import propertyRoutes from "./src/routes/PropertyRoutes.js";
import userRoutes from "./src/routes/UserRoutes.js";
import inquiryRoutes from "./src/routes/InquiryRoutes.js";
import externalApiRoutes from "./src/routes/ExternalApiRoutes.js";
import socialRoutes from "./src/routes/SocialRoutes.js";
import { requireAdmin } from "./src/middleware/AuthMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use(authRoutes);
app.use(propertyRoutes);
app.use(userRoutes);
app.use(inquiryRoutes);
app.use(externalApiRoutes);
app.use(socialRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
