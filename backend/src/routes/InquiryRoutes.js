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

// Anyone can submit an inquiry (optionally attach submittedBy if logged in).
// protect is called but failures are swallowed so unauthenticated users still pass.
router.post("/api/inquiries", (req, res, next) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  return next();
}, addInquiry);

// Only admins can browse all inquiries or update status.
router.get("/api/inquiries", protect, requireAdmin, getAllInquiries);
router.get("/api/inquiries/:id", protect, requireAdmin, getInquiry);
router.put("/api/inquiries/:id", protect, requireAdmin, editInquiry);

// Ownership rule: logged-in submitter OR admin can delete.
router.delete("/api/inquiries/:id", protect, removeInquiry);

export default router;
