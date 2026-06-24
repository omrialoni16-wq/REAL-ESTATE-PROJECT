import mongoose from "mongoose";
import User from "../models/User.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createUser = async (userData) => {
  if (!userData || typeof userData !== "object") {
    throw new Error("User data must be a valid object.");
  }

  const newUser = new User(userData);
  return await newUser.save();
};

export const fetchAllUsers = async () => {
  return await User.find().sort({ createdAt: -1 }).limit(300);
};

export const fetchUserById = async (id) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid user ID.");
  }

  return await User.findById(id);
};

export const updateUser = async (id, userData) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid user ID.");
  }

  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid user ID.");
  }

  return await User.findByIdAndDelete(id);
};

