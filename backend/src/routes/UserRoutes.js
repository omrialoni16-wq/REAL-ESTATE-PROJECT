import express from "express";
import {
  addUser,
  getAllUsers,
  getUser,
  editUser,
  removeUser,
  createAdmin,
} from "../controllers/UserController.js";
import { protect, requireAdmin, requireSelfOrAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/api/users", addUser);
router.get("/api/users",protect, requireAdmin, getAllUsers);
router.get("/api/users/:id", getUser);
router.put("/api/users/:id", protect, requireSelfOrAdmin, editUser);
router.delete("/api/users/:id", protect, requireAdmin, removeUser);
router.post("/api/admin", protect, requireAdmin, createAdmin);

export default router;
