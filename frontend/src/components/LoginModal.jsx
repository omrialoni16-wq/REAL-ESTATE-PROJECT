import React, { useState } from "react";
import axios from "axios";
import "./RegistrationModal.css";
import { API_URL } from "../config";

const EMPTY_FORM = { email: "", password: "" };

const LoginModal = ({ onClose, onLoggedIn }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (onLoggedIn) onLoggedIn(response.data.user);
      onClose();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
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
          <h3 className="registration-title">Sign In</h3>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="form-error">⚠️ {error}</p>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
