import express from "express";
import { register, login, getMe } from "../controllers/AuthController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.get("/api/auth/me", protect, getMe);

export default router;
