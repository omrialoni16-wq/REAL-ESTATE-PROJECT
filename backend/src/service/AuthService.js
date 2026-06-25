import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Sign a short JWT carrying the user id and role so middleware can
// authorize without an extra DB read on every request.
export const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured on the server.");
  }
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

// Strip the password before sending a user object back to the client.
const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  return user;
};


export const registerUser = async (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Registration data must be a valid object.");
  }

  const { firstName, lastName, email, phone, password, role } = payload;

  if (!firstName || !lastName || !email || !password || !role) {
    throw new Error(
      "firstName, lastName, email, password and role are required.",
    );
  }

  if (role !== "Buyer") {
    throw new Error('Only "Buyer" accounts can be registered.');
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const user = await new User({ firstName, lastName, email, phone, password, role }).save();
  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};

// Login verifies credentials and returns a fresh token.
export const loginUser = async ({ email, password } = {}) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // password has select:false, so explicitly pull it for comparison.
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};
