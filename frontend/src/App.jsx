import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropertyCard from "./components/PropertyCard";
import AddPropertyForm from "./components/AddPropertyForm";
import EditPropertyForm from "./components/EditPropertyForm";
import RegistrationModal from "./components/RegistrationModal";
import LoginModal from "./components/LoginModal";
import InquiryModal from "./components/InquiryModal";
import UserProfileModal from "./components/UserProfileModal";
import AdminPanel from "./components/AdminPanel";
import PropertyMap from "./components/PropertyMap";
import WeatherWidget from "./components/WeatherWidget";
import PriceByCityChart from "./components/charts/PriceByCityChart";
import PropertyTypePieChart from "./components/charts/PropertyTypePieChart";
import "./App.css";
import FilterBar from "./components/FilterBar";
import Pagination from "./components/Pagination";
import { API_URL } from "./config";

function App() {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [filters, setFilters] = useState({ city: "", maxPrice: "", type: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 21;

  const [isLoading, setIsLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [locationProperty, setLocationProperty] = useState(null);
  const [inquiryProperty, setInquiryProperty] = useState(null);

  const fetchProperties = useCallback(async (activeFilters) => {
    setIsLoading(true);
    try {
      const params = {};
      if (activeFilters.city.trim()) params.city = activeFilters.city.trim();
      if (activeFilters.maxPrice !== "") params.maxPrice = activeFilters.maxPrice;
      if (activeFilters.type !== "All") params.type = activeFilters.type;

      const response = await axios.get(`${API_URL}/api/properties`, { params });
      setProperties(response.data);
    } catch (error) {
      console.error("failed to fetch properties", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(filters);

  }, []);

  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => fetchProperties(filters), 400);
    return () => clearTimeout(timer);
  }, [filters, fetchProperties]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === "Admin";

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(`${API_URL}/api/properties/${propertyId}`);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Could not delete property. Please try again.");
    }
  };

  const handleEditProperty = async (updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/properties/${editingProperty._id}`,
        updatedData,
      );
      setProperties((prev) =>
        prev.map((p) => (p._id === editingProperty._id ? response.data : p)),
      );
      alert("Property updated successfully!");
      setEditingProperty(null);
    } catch (error) {
      console.error("Failed updating property:", error);
      alert("Could not update property. Check server console.");
    }
  };

  const handleAddProperty = async (newPropertyData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/properties`,
        newPropertyData,
      );
      setProperties((prev) => [response.data, ...prev]);
      alert("Property added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed adding property:", error);
      alert("Could not add property. Check server console.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handlePublishToTwitter = (property) => {
    const text = [
      `🏠 New listing: ${property.type} in ${property.city}`,
      `💰 ₪${property.price?.toLocaleString()} · ${property.rooms} rooms · ${property.size} sqm`,
      `📍 ${property.street}, ${property.city}`,
      `#RealEstate #${property.city.replace(/\s+/g, "")}`,
    ].join("\n");

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const indexOfLast = currentPage * propertiesPerPage;
  const indexOfFirst = indexOfLast - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirst, indexOfLast);

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
              <button className="register-btn" onClick={() => setIsProfileOpen(true)}>
                Edit Profile
              </button>
              <button className="register-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="register-btn" onClick={() => setIsLoginOpen(true)}>
                Sign In
              </button>
              <button className="register-btn" onClick={() => setIsRegisterOpen(true)}>
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
          onLoggedIn={(user) => {
            setCurrentUser(user);
            setIsLoginOpen(false);
          }}
        />
      )}

      {isProfileOpen && currentUser && (
        <UserProfileModal
          user={currentUser}
          onClose={() => setIsProfileOpen(false)}
          onUpdated={(updated) => {
            setCurrentUser(updated);
            setIsProfileOpen(false);
          }}
        />
      )}

      {inquiryProperty && (
        <InquiryModal
          property={inquiryProperty}
          onClose={() => setInquiryProperty(null)}
        />
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
              ✖
            </button>
            <AddPropertyForm onAdd={handleAddProperty} />
          </div>
        </div>
      )}

      {editingProperty && (
        <div className="modal-overlay" onClick={() => setEditingProperty(null)}>
          <div
            className="modal-content edit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-btn" onClick={() => setEditingProperty(null)}>
              ✖
            </button>
            <EditPropertyForm
              property={editingProperty}
              onSave={handleEditProperty}
              onCancel={() => setEditingProperty(null)}
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
            <button className="close-modal-btn" onClick={() => setLocationProperty(null)}>
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

      {isAdmin && (
        <button className="fab" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      )}

      {isAdmin && !isLoading && properties.length > 0 && (
        <section className="charts-section" aria-label="Listings analytics">
          <PriceByCityChart properties={properties} />
          <PropertyTypePieChart properties={properties} />
        </section>
      )}

      {isAdmin && <AdminPanel currentUser={currentUser} onUserDeleted={() => {}} />}

      <div className="chart-tooltip" />

      <section className="listings-section" aria-label="Property listings">
        {isLoading ? (
          <div className="loading-message">
            <h2>Loading properties… ⏳</h2>
          </div>
        ) : (
          <div className="properties-grid">
            {currentProperties.length > 0 ? (
              currentProperties.map((item) => (
                <PropertyCard
                  key={item._id}
                  property={item}
                  onDelete={handleDelete}
                  onEdit={setEditingProperty}
                  onViewLocation={setLocationProperty}
                  onPublish={handlePublishToTwitter}
                  onInquire={setInquiryProperty}
                  canManage={isAdmin}
                />
              ))
            ) : (
              <p>No properties match your filters.</p>
            )}
          </div>
        )}

        <Pagination
          propertiesPerPage={propertiesPerPage}
          totalProperties={properties.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </section>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} My Property Listings — All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
