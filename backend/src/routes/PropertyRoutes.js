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

const router = express.Router();

// Specific paths must be declared BEFORE the "/:id" route so they are
// not swallowed by the id matcher.
router.get("/api/properties/search", searchByLocationBudget);
router.get("/api/properties/search/space", searchByBudgetSpace);
router.get("/api/properties/stats/price-by-city", getStatsAveragePriceByCity);
router.get("/api/properties/stats/count-by-type", getStatsCountByType);
router.get("/api/properties/feed/:buyerId", getFeed); // buyer's personalized feed

router.get("/api/properties", getAllProperties);
router.post("/api/properties", addProperty);
router.get("/api/properties/:id", getProperty);
router.put("/api/properties/:id", editProperty);
router.delete("/api/properties/:id", removeProperty);

export default router;
