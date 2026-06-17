import express from "express";
import {
  addProperty,
  getAllProperties,
  removeProperty,
  editProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.post("/api/properties", addProperty);
router.get("/api/properties", getAllProperties);
router.put("/api/properties/:id", editProperty);
router.delete("/api/properties/:id", removeProperty);

export default router;

