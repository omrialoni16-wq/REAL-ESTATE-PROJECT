import mongoose from "mongoose";
import Property from "../models/Property.js";
import User from "../models/User.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProperty = async (propertyData) => {
  if (!propertyData || typeof propertyData !== "object") {
    throw new Error("Property data must be a valid object.");
  }

  const newProperty = new Property(propertyData);
  return await newProperty.save();
};

export const fetchAllProperties = async () => {
  return await Property.find().sort({ createdAt: -1 }).limit(600).populate("listedBy", "firstName lastName agencyName role");
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
    .populate("listedBy", "firstName lastName agencyName role");
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
    .populate("listedBy", "firstName lastName agencyName role");
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

/* --------------------------------------------------------------------------
 * THE FEED — properties from agencies a buyer follows
 * ------------------------------------------------------------------------ */

// Personalized feed: newest properties listed exclusively by the
// agencies this buyer has subscribed to/followed.
export const getBuyerFeed = async (buyerId) => {
  if (!validateObjectId(buyerId)) {
    throw new Error("Invalid buyer ID.");
  }

  const buyer = await User.findById(buyerId).select("role following");
  if (!buyer) {
    throw new Error("Buyer not found.");
  }
  if (buyer.role !== "Buyer") {
    throw new Error("Only buyers have a personalized feed.");
  }

  // No subscriptions yet → empty feed.
  if (!buyer.following || buyer.following.length === 0) {
    return [];
  }

  return await Property.find({ listedBy: { $in: buyer.following } })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("listedBy", "firstName lastName agencyName role");
};