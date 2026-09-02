import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const EMPTY = { name: "", email: "", phone: "", message: "" };

const InquiryModal = ({ property, onClose }) => {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/inquiries`, {
        ...form,
        propertyId: property._id,
      });
      setSuccess(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>✖</button>

        <h3 style={{ marginTop: 0, color: "#2c3e50" }}>
          Contact Agent — {property.street}, {property.city}
        </h3>

        {success ? (
          <p style={{ color: "#fff", background: "#1a1a1a", padding: "12px", borderRadius: "8px" }}>
            ✅ Inquiry sent! The agent will be in touch shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="form-row">
              <input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem" }}
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem" }}
              />
            </div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem" }}
            />
            <textarea
              name="message"
              placeholder="Your message (min 10 characters)"
              value={form.message}
              onChange={handleChange}
              required
              minLength={10}
              rows={4}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", resize: "vertical" }}
            />
            {error && (
              <p style={{ color: "#c0392b", background: "rgba(231,76,60,0.1)", padding: "10px", borderRadius: "8px", margin: 0 }}>
                ⚠️ {error}
              </p>
            )}
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
