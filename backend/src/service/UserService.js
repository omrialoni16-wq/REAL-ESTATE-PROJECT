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

  return await User.findById(id).populate("followers following", "firstName lastName email role agencyName");
};

export const updateUser = async (id, userData) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid user ID.");
  }

  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  }).populate("followers following", "firstName lastName email role agencyName");
};

export const deleteUser = async (id) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid user ID.");
  }

  return await User.findByIdAndDelete(id);
};

export const followAgency = async (buyerId, agencyId) => {
  if (!validateObjectId(buyerId) || !validateObjectId(agencyId)) {
    throw new Error("Invalid buyer or agency ID.");
  }

  if (buyerId === agencyId) {
    throw new Error("A user cannot follow themselves.");
  }

  const buyer = await User.findById(buyerId);
  const agency = await User.findById(agencyId);

  if (!buyer || !agency) {
    throw new Error("Buyer or agency user not found.");
  }

  if (buyer.role !== "Buyer") {
    throw new Error("Only buyers can follow agencies.");
  }

  if (agency.role !== "Agency") {
    throw new Error("Can only follow users with the Agency role.");
  }

  if (buyer.following.includes(agencyId)) {
    return { buyer, agency };
  }

  buyer.following.push(agencyId);
  agency.followers.push(buyerId);

  await Promise.all([buyer.save(), agency.save()]);
  return { buyer, agency };
};

export const unfollowAgency = async (buyerId, agencyId) => {
  if (!validateObjectId(buyerId) || !validateObjectId(agencyId)) {
    throw new Error("Invalid buyer or agency ID.");
  }

  const buyer = await User.findById(buyerId);
  const agency = await User.findById(agencyId);

  if (!buyer || !agency) {
    throw new Error("Buyer or agency user not found.");
  }

  if (buyer.role !== "Buyer") {
    throw new Error("Only buyers can unfollow agencies.");
  }

  buyer.following = buyer.following.filter(
    (followedAgencyId) => followedAgencyId.toString() !== agencyId,
  );
  agency.followers = agency.followers.filter(
    (followerId) => followerId.toString() !== buyerId,
  );

  await Promise.all([buyer.save(), agency.save()]);
  return { buyer, agency };
};
