import express from "express";
import { getWeather, getGeocode } from "../controllers/ExternalApiController.js";

const router = express.Router();

router.get("/api/external/weather", getWeather);

router.get("/api/external/geocode", getGeocode);

export default router;
