import Property from "../models/Property.js";

export const createProperty = async (propertyData) => {
  try {
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();
    return savedProperty;
  } catch (error) {
    console.error("Error creating property!:", error);
    throw error;
  }
};


export const fetchAllProperties = async () => {
  try {
    // שליפת כל המסמכים מקולקציית "apartments"
    const properties = await Property.find(); 
    return properties;
  } catch (error) {
    console.error("Error fetching properties!:", error);
    throw error;
  }
};