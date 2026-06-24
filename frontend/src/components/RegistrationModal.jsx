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
};

const RegistrationModal = ({ onClose, onRegistered }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
