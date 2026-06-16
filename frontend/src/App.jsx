import { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./components/PropertyCard";
import AddPropertyForm from "./components/AddPropertyForm";
import EditPropertyForm from "./components/EditPropertyForm";
import "./App.css";
import FilterBar from "./components/FilterBar";
import Pagination from "./components/Pagination";

function App() {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    maxPrice: "",
    type: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 21;

  const [isLoading, setIsLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/properties",
        );
        console.log("fetch properties:", response.data);
        setProperties(response.data);
        setIsModalOpen(false);
      } catch (error) {
        console.error("failed to fetch properties", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleDelete = async (propertyId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/api/properties/${propertyId}`,
        );
        const updatedProperties = properties.filter(
          (property) => property._id !== propertyId,
        );
        setProperties(updatedProperties);
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Could not delete property. Please try again.");
      }
    }
  };

  const handleEditProperty = async (updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/properties/${editingProperty._id}`,
        updatedData,
      );
      setProperties(
        properties.map((p) =>
          p._id === editingProperty._id ? response.data : p,
        ),
      );
      alert("Property updated successfully!");
      setEditingProperty(null);
    } catch (error) {
      console.error("Failed updating property:", error);
      alert("Could not update property. Check server console.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
  };

  const handleAddProperty = async (newPropertyData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/properties",
        newPropertyData,
      );
      setProperties([response.data, ...properties]);
      alert("Property added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed adding property:", error);
      alert("Could not add property. Check server console.");
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesCity = property.city
      .toLowerCase()
      .includes(filters.city.toLowerCase());

    const matchesPrice =
      filters.maxPrice === ""
        ? true
        : property.price <= Number(filters.maxPrice);

    const matchesType =
      filters.type === "All" ? true : property.type === filters.type;

    return matchesCity && matchesPrice && matchesType;
  });

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  );

  return (
    <div className="app-container">
      <h1>My Property Listings</h1>

      <FilterBar filters={filters} setFilters={setFilters} />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
            <AddPropertyForm onAdd={handleAddProperty} />
          </div>
        </div>
      )}

      {editingProperty && (
        <div
          className="modal-overlay"
          onClick={() => setEditingProperty(null)}
        >
          <div className="modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={handleCancelEdit}
            >
              ✖
            </button>
            <EditPropertyForm
              property={editingProperty}
              onSave={handleEditProperty}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}

      <button className="fab" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {isLoading ? (
        <div className="loading-message">
          <h2>Loading properties... ⏳</h2>
        </div>
      ) : (
        <div className="properties-grid">
          {currentProperties && currentProperties.length > 0 ? (
            currentProperties.map((item) => (
              <PropertyCard
                key={item._id}
                property={item}
                onDelete={handleDelete}
                onEdit={setEditingProperty}
              />
            ))
          ) : (
            <p>No properties match your filters.</p>
          )}
        </div>
      )}

      <Pagination
        propertiesPerPage={propertiesPerPage}
        totalProperties={filteredProperties.length}
        paginate={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default App;
