import {
  fetchAllProperties,
  createProperty,
  deleteProperty,
} from "../service/PropertyService.js";

export const addProperty = async (req, res) => {
  try {
    const propertyData = req.body;
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
    // קריאה לפונקציה מה-Service שייבאת בשורה 2
    const properties = await fetchAllProperties(); 
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error getting all properties:", error);
    res.status(500).json({
      message: "Failed to fetch properties.",
      error: error.message,
    });
  }
};
