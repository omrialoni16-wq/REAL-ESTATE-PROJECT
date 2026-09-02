import express from "express";
import { publishToTwitter } from "../controllers/SocialController.js";

const router = express.Router();

router.post("/api/social/twitter", publishToTwitter);

export default router;
