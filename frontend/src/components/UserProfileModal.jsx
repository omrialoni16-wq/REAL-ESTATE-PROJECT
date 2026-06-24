import { useState } from "react";
import axios from "axios";

const UserProfileModal = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
  });
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
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, form);
      const updated = { ...user, ...res.data };
      localStorage.setItem("user", JSON.stringify(updated));
      if (onUpdated) onUpdated(updated);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
        <button className="close-modal-btn" onClick={onClose}>✖</button>
        <h3 style={{ marginTop: 0, color: "#2c3e50" }}>Edit Profile</h3>

        {success ? (
          <p style={{ color: "#1e7e4f", background: "rgba(46,204,113,0.12)", padding: "12px", borderRadius: "8px" }}>
            ✅ Profile updated!
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="form-row">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem" }}
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem" }}
              />
            </div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem" }}
            />
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#7f8c8d" }}>
              Email and role cannot be changed here.
            </p>
            {error && (
              <p style={{ color: "#c0392b", background: "rgba(231,76,60,0.1)", padding: "10px", borderRadius: "8px", margin: 0 }}>
                ⚠️ {error}
              </p>
            )}
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
