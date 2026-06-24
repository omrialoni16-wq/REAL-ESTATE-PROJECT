import {
  createUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
  deleteUser,
} from "../service/UserService.js";

const handleControllerError = (res, error, fallbackMessage, status = 500) => {
  console.error(fallbackMessage, error);
  const message = error.message || fallbackMessage;
  const statusCode = status === 500 && error.name === "ValidationError" ? 400 : status;
  return res.status(statusCode).json({ message, error: error.message });
};

export const addUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    return handleControllerError(res, error, "Failed to create user.");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return handleControllerError(res, error, "Failed to retrieve users.");
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return handleControllerError(res, error, "Failed to retrieve user.");
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await updateUser(id, userData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return handleControllerError(res, error, "Failed to update user.");
  }
};

export const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ message: "User deleted.", user: deletedUser });
  } catch (error) {
    return handleControllerError(res, error, "Failed to delete user.");
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "firstName, lastName, email and password are required." });
    }
    const user = await createUser({ firstName, lastName, email, password, phone: phone || "", role: "Admin" });
    const safeUser = user.toObject();
    delete safeUser.password;
    return res.status(201).json(safeUser);
  } catch (error) {
    return handleControllerError(res, error, "Failed to create admin.");
  }
};

