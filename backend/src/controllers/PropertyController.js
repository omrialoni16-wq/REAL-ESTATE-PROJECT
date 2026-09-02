import {
  fetchAllProperties,
  fetchPropertyById,
  createProperty,
  deleteProperty,
  updateProperty,
  searchPropertiesByLocationBudget,
  searchPropertiesByBudgetAndSpace,
  getAveragePriceByCity,
  getPropertyCountByType,
} from "../service/PropertyService.js";

export const addProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body };

    if (!propertyData.img || !propertyData.img.trim()) {
      delete propertyData.img;
    }
    const savedPropertyController = await createProperty(propertyData);
    res.status(201).json(savedPropertyController);
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(400).json({
      message: "Error adding property. Check your data.",
      error: error.message,
    });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const { city, maxPrice, type } = req.query;
    const properties = await fetchAllProperties({ city, maxPrice, type });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error getting all properties:", error);
    res.status(500).json({
      message: "Failed to fetch properties.",
      error: error.message,
    });
  }
};

export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await fetchPropertyById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error("Error getting property:", error);
    res.status(400).json({
      message: "Failed to fetch property.",
      error: error.message,
    });
  }
};

export const editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyData = req.body;
    const updated = await updateProperty(id, propertyData);
    if (!updated) {
      return res.status(404).json({ message: "Property not found." });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error editing property:", error);
    res.status(400).json({
      message: "Error updating property.",
      error: error.message,
    });
  }
};

export const removeProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProperty(id);
    if (!deleted) {
      return res.status(404).json({ message: "Property not found." });
    }
    res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(400).json({
      message: "Error deleting property.",
      error: error.message,
    });
  }
};

export const searchByLocationBudget = async (req, res) => {
  try {
    const results = await searchPropertiesByLocationBudget(req.query);
    res.status(200).json({ count: results.length, results });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(400).json({ message: "Search failed.", error: error.message });
  }
};

export const searchByBudgetSpace = async (req, res) => {
  try {
    const results = await searchPropertiesByBudgetAndSpace(req.query);
    res.status(200).json({ count: results.length, results });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(400).json({ message: "Search failed.", error: error.message });
  }
};

export const getStatsAveragePriceByCity = async (req, res) => {
  try {
    const stats = await getAveragePriceByCity();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error aggregating prices by city:", error);
    res.status(500).json({ message: "Aggregation failed.", error: error.message });
  }
};

export const getStatsCountByType = async (req, res) => {
  try {
    const stats = await getPropertyCountByType();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error aggregating counts by type:", error);
    res.status(500).json({ message: "Aggregation failed.", error: error.message });
  }
};

