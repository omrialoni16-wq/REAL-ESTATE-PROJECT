import mongoose from "mongoose";
import Property from "../models/Property.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProperty = async (propertyData) => {
  if (!propertyData || typeof propertyData !== "object") {
    throw new Error("Property data must be a valid object.");
  }

  const newProperty = new Property(propertyData);
  return await newProperty.save();
};

export const fetchAllProperties = async () => {
  return await Property.find().sort({ createdAt: -1 }).limit(300).populate("listedBy", "firstName lastName agencyName role");
};

export const fetchPropertyById = async (id) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid property ID.");
  }

  return await Property.findById(id).populate("listedBy", "firstName lastName agencyName role");
};

export const updateProperty = async (id, propertyData) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid property ID.");
  }

  return await Property.findByIdAndUpdate(id, propertyData, {
    new: true,
    runValidators: true,
  }).populate("listedBy", "firstName lastName agencyName role");
};

export const deleteProperty = async (id) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid property ID.");
  }

  try {
<<<<<<< HEAD
   
    const properties = await Property.find(); 
    return properties;
=======
    const deleted = await Property.findByIdAndDelete(id);
    return deleted;
>>>>>>> 8264321a60d53cf55b1f25275417cae1d4773eac
  } catch (error) {
    console.error("Error deleting property!:", error);
    throw error;
  }
};