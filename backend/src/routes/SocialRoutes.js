import express from "express";
import { publishToTwitter } from "../controllers/SocialController.js";

const router = express.Router();

// POST /api/social/twitter  — body: the property object to publish
router.post("/api/social/twitter", publishToTwitter);

export default router;
