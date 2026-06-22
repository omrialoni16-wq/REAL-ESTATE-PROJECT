import express from "express";
import {
  addProperty,
  getAllProperties,
  getProperty,
  removeProperty,
  editProperty,
  searchByLocationBudget,
  searchByBudgetSpace,
  getStatsAveragePriceByCity,
  getStatsCountByType,
  getFeed,
} from "../controllers/propertyController.js";
import { protect, requireAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Specific paths must be declared BEFORE the "/:id" route so they are
// not swallowed by the id matcher.
// --- Public reads (anyone, even logged out, can browse) ---
router.get("/api/properties/search", searchByLocationBudget);
router.get("/api/properties/search/space", searchByBudgetSpace);
router.get("/api/properties/stats/price-by-city", getStatsAveragePriceByCity);
router.get("/api/properties/stats/count-by-type", getStatsCountByType);
router.get("/api/properties/feed/:buyerId", getFeed); // buyer's personalized feed

router.get("/api/properties", getAllProperties);
router.get("/api/properties/:id", getProperty);

// --- Writes (CRUD): admins only, must be signed in with a valid token ---
router.post("/api/properties", protect, requireAdmin, addProperty);
router.put("/api/properties/:id", protect, requireAdmin, editProperty);
router.delete("/api/properties/:id", protect, requireAdmin, removeProperty);

export default router;
