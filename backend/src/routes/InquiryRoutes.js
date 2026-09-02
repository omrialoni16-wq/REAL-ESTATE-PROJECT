import express from "express";
import {
  addInquiry,
  getAllInquiries,
  getInquiry,
  editInquiry,
  removeInquiry,
} from "../controllers/InquiryController.js";
import { protect, requireAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/api/inquiries", (req, res, next) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  return next();
}, addInquiry);

router.get("/api/inquiries", protect, requireAdmin, getAllInquiries);
router.get("/api/inquiries/:id", protect, requireAdmin, getInquiry);
router.put("/api/inquiries/:id", protect, requireAdmin, editInquiry);

router.delete("/api/inquiries/:id", protect, removeInquiry);

export default router;
