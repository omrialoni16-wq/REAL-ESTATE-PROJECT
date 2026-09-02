import { registerUser, loginUser } from "../service/AuthService.js";
import { fetchUserById } from "../service/UserService.js";

const handleAuthError = (res, error, fallbackMessage, status = 400) => {
  console.error(fallbackMessage, error);
  const message = error.message || fallbackMessage;
  const statusCode = error.name === "ValidationError" ? 400 : status;
  return res.status(statusCode).json({ message, error: error.message });
};

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return handleAuthError(res, error, "Registration failed.");
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleAuthError(res, error, "Login failed.", 401);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await fetchUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return handleAuthError(res, error, "Failed to load profile.", 500);
  }
};
