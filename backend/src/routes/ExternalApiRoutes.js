import express from "express";
import { getWeather, getGeocode } from "../controllers/ExternalApiController.js";

const router = express.Router();

// GET /api/external/weather?city=Tel%20Aviv
router.get("/api/external/weather", getWeather);
// GET /api/external/geocode?q=Herzl%2010%2C%20Tel%20Aviv
router.get("/api/external/geocode", getGeocode);

export default router;
