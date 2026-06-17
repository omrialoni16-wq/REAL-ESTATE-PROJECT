import {
  fetchAllProperties,
  createProperty,
  deleteProperty,
  updateProperty,
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