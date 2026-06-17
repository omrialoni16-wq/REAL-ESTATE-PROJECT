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
    const properties = await Property.find().sort({ _id: -1 }).limit(300);
    return properties;
  } catch (error) {
    console.error("Error fetching properties!:", error);
    throw error;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const updated = await Property.findByIdAndUpdate(id, propertyData, {
      new: true,
      runValidators: true,
    });
    return updated;
  } catch (error) {
    console.error("Error updating property!:", error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const deleted = await Property.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    console.error("Error deleting property!:", error);
    throw error;
  }
};