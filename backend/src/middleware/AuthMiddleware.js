import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the Bearer JWT and attaches { id, role } to req.user.
// Blocks every unauthenticated request to the main app.
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Bearer token required." });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm the user still exists (token could outlive the account).
    const user = await User.findById(decoded.id).select("_id role");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = { id: user._id.toString(), role: user.role };
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token.", error: error.message });
  }
};

// Allows only Admin accounts (e.g. managing property listings).
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  if (req.user.role !== "Admin") {
    return res
      .status(403)
      .json({ message: "Only admins can perform this action." });
  }
  return next();
};

// Allows a user to modify their own account, or an admin to modify any account.
export const requireSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  if (req.user.role === "Admin" || req.params.id === req.user.id) {
    return next();
  }
  return res.status(403).json({ message: "You can only modify your own account." });
};

