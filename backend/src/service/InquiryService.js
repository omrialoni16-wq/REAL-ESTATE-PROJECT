import mongoose from "mongoose";
import Inquiry from "../models/Inquiry.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createInquiry = async (data) => {
  if (!data || typeof data !== "object") {
    throw new Error("Inquiry data must be a valid object.");
  }
  const inquiry = new Inquiry(data);
  return await inquiry.save();
};

export const fetchAllInquiries = async ({ status, propertyId } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  if (propertyId && validateObjectId(propertyId)) filter.propertyId = propertyId;

  return await Inquiry.find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .populate("propertyId", "street city type price");
};

export const fetchInquiryById = async (id) => {
  if (!validateObjectId(id)) throw new Error("Invalid inquiry ID.");
  return await Inquiry.findById(id).populate("propertyId", "street city type price");
};

export const updateInquiry = async (id, data) => {
  if (!validateObjectId(id)) throw new Error("Invalid inquiry ID.");
  return await Inquiry.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteInquiry = async (id) => {
  if (!validateObjectId(id)) throw new Error("Invalid inquiry ID.");
  return await Inquiry.findByIdAndDelete(id);
};
