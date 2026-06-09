import express from "express";
import {
  addProperty,
  getAllProperties,
  removeProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.post("/api/properties", addProperty);
router.get("/api/properties", getAllProperties);

export default router;

