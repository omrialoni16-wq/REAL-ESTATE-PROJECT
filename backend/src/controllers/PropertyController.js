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
