import { useState } from "react";

const EditPropertyForm = ({ property, onSave }) => {
  const [formData, setFormData] = useState({
    street: property.street || "",
    city: property.city || "",
    price: property.price || "",
    rooms: property.rooms || "",
    floor: property.floor || "",
    size: property.size || "",
    type: property.type || "Apartment",
    img: property.img || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      <h3>Edit Property</h3>
      <div className="form-row">
        <input
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
      <input
        name="price"
        type="number"
        placeholder="Price (₪)"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <div className="form-row">
        <input
          name="rooms"
          type="number"
          placeholder="Rooms"
          value={formData.rooms}
          onChange={handleChange}
          required
        />
        <input
          name="floor"
          type="number"
          placeholder="Floor"
          value={formData.floor}
          onChange={handleChange}
          required
        />
        <input
          name="size"
          type="number"
          placeholder="Size (sqm)"
          value={formData.size}
          onChange={handleChange}
          required
        />
      </div>
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="Apartment">Apartment</option>
        <option value="Penthouse">Penthouse</option>
        <option value="House">House</option>
      </select>
      <input
        name="img"
        placeholder="Image URL"
        value={formData.img}
        onChange={handleChange}
      />
      <button type="submit" className="submit-btn edit-submit-btn">
        Save Changes
      </button>
    </form>
  );
};

export default EditPropertyForm;
