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

export const fetchAllProperties = async ({ city, maxPrice, type } = {}) => {
  const filter = {};
  if (city && city.trim()) filter.city = new RegExp(city.trim(), "i");
  if (maxPrice && maxPrice !== "") filter.price = { $lte: Number(maxPrice) };
  if (type && type !== "All") filter.type = type;

  return await Property.find(filter)
    .sort({ createdAt: -1 })
    .limit(600)
    .populate("listedBy", "firstName lastName role");
};

export const fetchPropertyById = async (id) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid property ID.");
  }

  return await Property.findById(id).populate("listedBy", "firstName lastName role");
};

export const updateProperty = async (id, propertyData) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid property ID.");
  }

  return await Property.findByIdAndUpdate(id, propertyData, {
    new: true,
    runValidators: true,
  }).populate("listedBy", "firstName lastName role");
};

export const deleteProperty = async (id) => {
  if (!validateObjectId(id)) {
    throw new Error("Invalid property ID.");
  }

  try {
    const deleted = await Property.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    console.error("Error deleting property!:", error);
    throw error;
  }
};

/* --------------------------------------------------------------------------
 * ADVANCED SEARCH (each takes 3+ parameters, all optional & combinable)
 * ------------------------------------------------------------------------ */

// Search #1: by location, budget and minimum rooms (+ optional type).
// e.g. /api/properties/search?city=Tel Aviv&maxPrice=6000000&minRooms=3
export const searchPropertiesByLocationBudget = async ({
  city,
  maxPrice,
  minRooms,
  type,
} = {}) => {
  const filter = {};

  if (city) filter.city = new RegExp(`^${city.trim()}$`, "i");
  if (maxPrice !== undefined && maxPrice !== "")
    filter.price = { $lte: Number(maxPrice) };
  if (minRooms !== undefined && minRooms !== "")
    filter.rooms = { $gte: Number(minRooms) };
  if (type) filter.type = type;

  return await Property.find(filter)
    .sort({ price: 1 })
    .limit(200)
    .populate("listedBy", "firstName lastName role");
};

// Search #2: by price range and minimum size (+ optional listing tier).
// e.g. /api/properties/search/space?minPrice=3000000&maxPrice=9000000&minSize=80
export const searchPropertiesByBudgetAndSpace = async ({
  minPrice,
  maxPrice,
  minSize,
  listingType,
} = {}) => {
  const filter = {};

  const priceFilter = {};
  if (minPrice !== undefined && minPrice !== "")
    priceFilter.$gte = Number(minPrice);
  if (maxPrice !== undefined && maxPrice !== "")
    priceFilter.$lte = Number(maxPrice);
  if (Object.keys(priceFilter).length) filter.price = priceFilter;

  if (minSize !== undefined && minSize !== "")
    filter.size = { $gte: Number(minSize) };
  if (listingType) filter.listingType = listingType;

  return await Property.find(filter)
    .sort({ size: -1 })
    .limit(200)
    .populate("listedBy", "firstName lastName role");
};

/* --------------------------------------------------------------------------
 * GROUP BY AGGREGATIONS
 * ------------------------------------------------------------------------ */

// Aggregation #1: average / min / max price grouped by city.
export const getAveragePriceByCity = async () => {
  return await Property.aggregate([
    {
      $group: {
        _id: "$city",
        averagePrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        city: "$_id",
        averagePrice: { $round: ["$averagePrice", 0] },
        minPrice: 1,
        maxPrice: 1,
        count: 1,
      },
    },
    { $sort: { averagePrice: -1 } },
  ]);
};

// Aggregation #2: total number of properties grouped by type.
export const getPropertyCountByType = async () => {
  return await Property.aggregate([
    {
      $group: {
        _id: "$type",
        total: { $sum: 1 },
        averagePrice: { $avg: "$price" },
        averageRooms: { $avg: "$rooms" },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id",
        total: 1,
        averagePrice: { $round: ["$averagePrice", 0] },
        averageRooms: { $round: ["$averageRooms", 1] },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

