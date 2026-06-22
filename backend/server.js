import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import propertyRoutes from "./src/routes/PropertyRoutes.js";
import userRoutes from "./src/routes/UserRoutes.js";
import externalApiRoutes from "./src/routes/ExternalApiRoutes.js";
import socialRoutes from "./src/routes/SocialRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use(propertyRoutes);
app.use(userRoutes);
app.use(externalApiRoutes);
app.use(socialRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
