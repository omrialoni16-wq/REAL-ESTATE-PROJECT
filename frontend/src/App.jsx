import { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./components/PropertyCard";
import AddPropertyForm from "./components/AddPropertyForm";
import EditPropertyForm from "./components/EditPropertyForm";
import RegistrationModal from "./components/RegistrationModal";
import LoginModal from "./components/LoginModal";
import FloorPlanCanvas from "./components/FloorPlanCanvas";
import PropertyMap from "./components/PropertyMap";
import WeatherWidget from "./components/WeatherWidget";
import PriceByCityChart from "./components/charts/PriceByCityChart";
import PropertyTypePieChart from "./components/charts/PropertyTypePieChart";
import "./App.css";
import FilterBar from "./components/FilterBar";
import Pagination from "./components/Pagination";

function App() {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // Restore a previous session from localStorage if one exists.
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [filters, setFilters] = useState({
    city: "",
    maxPrice: "",
    type: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 21;

  const [isLoading, setIsLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [locationProperty, setLocationProperty] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
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

  const handlePublishToTwitter = async (property) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/social/twitter",
        property,
      );
      alert(`Published to Twitter!\n${response.data.url || ""}`);
    } catch (error) {
      const data = error.response?.data;
      if (data?.previewText) {
        // Credentials not configured — show what would have been posted.
        alert(
          `Twitter is not connected yet. Preview of the tweet:\n\n${data.previewText}`,
        );
      } else {
        console.error("Failed to publish to Twitter:", error);
        alert("Could not publish to Twitter. Check server console.");
      }
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
      <header className="app-header">
        <h1>My Property Listings</h1>
        <nav className="app-nav">
          {currentUser ? (
            <>
              <span className="user-greeting">
                Hi, {currentUser.firstName} ({currentUser.role})
              </span>
              <button className="register-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                className="register-btn"
                onClick={() => setIsLoginOpen(true)}
              >
                Sign In
              </button>
              <button
                className="register-btn"
                onClick={() => setIsRegisterOpen(true)}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <FilterBar filters={filters} setFilters={setFilters} />

      {isRegisterOpen && (
        <RegistrationModal onClose={() => setIsRegisterOpen(false)} />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLoggedIn={setCurrentUser}
        />
      )}

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

      {locationProperty && (
        <div className="modal-overlay" onClick={() => setLocationProperty(null)}>
          <div
            className="modal-content location-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setLocationProperty(null)}
            >
              ✖
            </button>
            <h2>
              {locationProperty.street}, {locationProperty.city}
            </h2>
            <p className="location-address">
              {locationProperty.type} · ₪
              {locationProperty.price?.toLocaleString()}
            </p>

            <PropertyMap
              lat={locationProperty.lat}
              lng={locationProperty.lng}
              address={`${locationProperty.street}, ${locationProperty.city}`}
              label={`${locationProperty.street}, ${locationProperty.city}`}
            />

            <WeatherWidget city={locationProperty.city} />

            <div className="location-actions">
              <button
                className="publish-btn"
                onClick={() => handlePublishToTwitter(locationProperty)}
              >
                𝕏 Publish this listing
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="fab" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {!isLoading && properties.length > 0 && (
        <section className="charts-section" aria-label="Listings analytics">
          <PriceByCityChart properties={properties} />
          <PropertyTypePieChart properties={properties} />
        </section>
      )}

      {/* Shared tooltip layer used by the D3 charts */}
      <div className="chart-tooltip" />

      <section className="listings-section" aria-label="Property listings">
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
                  onViewLocation={setLocationProperty}
                  onPublish={handlePublishToTwitter}
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
      </section>

      <aside className="features-aside" aria-label="Why choose us">
        <h3>Why choose us</h3>
        {/* multiple-columns: the feature list flows across CSS columns */}
        <ul className="feature-list">
          <li>Verified listings</li>
          <li>Sketch your floor plan</li>
          <li>Trusted local agencies</li>
          <li>No hidden fees</li>
          <li>Fast mortgage support</li>
          <li>Neighborhood insights</li>
          <li>24/7 customer care</li>
        </ul>
      </aside>

      <section className="media-section" aria-label="Property media tools">
        <article className="media-block">
          <h2>Sketch a Floor Plan</h2>
          <p className="media-hint">
            Draw a rough layout of your dream home below.
          </p>
          <FloorPlanCanvas />
        </article>
      </section>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} My Property Listings — All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
