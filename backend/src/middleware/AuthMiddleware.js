import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Property from "../models/Property.js";

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

// Allows only Agency accounts (e.g. publishing properties).
export const requireAgency = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  if (req.user.role !== "Agency") {
    return res
      .status(403)
      .json({ message: "Only Agency accounts can perform this action." });
  }
  return next();
};

// Ensures the authenticated Agency owns the property it tries to
// edit/delete. Loads the property once and caches it on the request.
export const requirePropertyOwnership = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).select("listedBy");
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (!property.listedBy || property.listedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only modify your own properties." });
    }

    req.property = property;
    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Ownership check failed.", error: error.message });
  }
};
