import React, { useState } from "react";
import axios from "axios";
import "./RegistrationModal.css";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "Buyer",
  agencyName: "",
  licenseNumber: "",
  officeAddress: "",
};

const RegistrationModal = ({ onClose, onRegistered }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isAgency = formData.role === "Agency";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    // Clear agency-only fields when switching back to Buyer so we never
    // submit stale data the backend would otherwise validate.
    setFormData((prev) => ({
      ...prev,
      role,
      ...(role === "Buyer"
        ? { agencyName: "", licenseNumber: "", officeAddress: "" }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );
      setSuccess(true);
      setFormData(EMPTY_FORM);
      if (onRegistered) onRegistered(response.data);
    } catch (err) {
      // Surface the backend validation message when available, otherwise
      // fall back to a generic network error for edge cases.
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content registration-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal-btn" onClick={onClose}>
          ✖
        </button>

        <form onSubmit={handleSubmit} className="registration-form">
          <h3 className="registration-title">Create Your Account</h3>

          <div className="role-toggle" role="group" aria-label="Account type">
            <button
              type="button"
              className={`role-option ${!isAgency ? "active" : ""}`}
              onClick={() => handleRoleSelect("Buyer")}
            >
              🏠 Buyer
            </button>
            <button
              type="button"
              className={`role-option ${isAgency ? "active" : ""}`}
              onClick={() => handleRoleSelect("Agency")}
            >
              🏢 Agency
            </button>
          </div>

          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          {/* Agency-only fields: collapsed for Buyers, revealed with a
              CSS transition when the Agency role is selected. */}
          <div
            className={`agency-fields ${isAgency ? "open" : ""}`}
            aria-hidden={!isAgency}
          >
            <input
              type="text"
              name="agencyName"
              placeholder="Agency name"
              value={formData.agencyName}
              onChange={handleChange}
              required={isAgency}
              disabled={!isAgency}
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="License number"
              value={formData.licenseNumber}
              onChange={handleChange}
              required={isAgency}
              disabled={!isAgency}
            />
            <input
              type="text"
              name="officeAddress"
              placeholder="Office address"
              value={formData.officeAddress}
              onChange={handleChange}
              required={isAgency}
              disabled={!isAgency}
            />
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}
          {success && (
            <p className="form-success">✅ Account created successfully!</p>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account…" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
