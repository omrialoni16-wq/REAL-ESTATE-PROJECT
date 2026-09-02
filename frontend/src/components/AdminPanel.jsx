import { useState, useEffect } from "react";
import axios from "axios";

const STATUS_COLORS = {
  new: "#e74c3c",
  read: "#e67e22",
  closed: "#27ae60",
};

const AdminPanel = ({ currentUser, onUserDeleted }) => {
  const [tab, setTab] = useState("inquiries"); // "inquiries" | "users"

  const [inquiries, setInquiries] = useState([]);
  const [inquiryFilter, setInquiryFilter] = useState("all");
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const r = await axios.get("http://localhost:5050/api/inquiries");
        setInquiries(r.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInquiries(false);
      }
    };
    loadInquiries();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const r = await axios.get("http://localhost:5050/api/users");
        setUsers(r.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5050/api/inquiries/${id}`, {
        status: newStatus,
      });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status: res.data.status } : inq)),
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await axios.delete(`http://localhost:5050/api/inquiries/${id}`);
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
    } catch {
      alert("Failed to delete inquiry.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5050/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      if (onUserDeleted) onUserDeleted(id);
    } catch {
      alert("Failed to delete user.");
    }
  };

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      const res = await axios.post("http://localhost:5050/api/admin", adminForm);
      setUsers((prev) => [res.data, ...prev]);
      setAdminForm({ firstName: "", lastName: "", email: "", password: "" });
      setShowCreateAdmin(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create admin.");
    } finally {
      setCreatingAdmin(false);
    }
  };

  const visibleInquiries =
    inquiryFilter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === inquiryFilter);

  const visibleUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      !q ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <section
      className="admin-panel"
      aria-label="Admin dashboard"
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "25px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        margin: "30px 0",
      }}
    >
      <h2 style={{ margin: "0 0 20px", color: "#2c3e50" }}>Admin Panel</h2>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["inquiries", "users"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              background: tab === t ? "#3498db" : "#ecf0f1",
              color: tab === t ? "#fff" : "#34495e",
              transition: "background 0.2s",
            }}
          >
            {t === "inquiries" ? "Inquiries" : "Users"}
          </button>
        ))}
      </div>

      {/* INQUIRIES TAB */}
      {tab === "inquiries" && (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            {["all", "new", "read", "closed"].map((s) => (
              <button
                key={s}
                onClick={() => setInquiryFilter(s)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  background: inquiryFilter === s ? "#2c3e50" : "#fff",
                  color: inquiryFilter === s ? "#fff" : "#34495e",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {loadingInquiries ? (
            <p>Loading inquiries…</p>
          ) : visibleInquiries.length === 0 ? (
            <p style={{ color: "#7f8c8d" }}>No inquiries found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    {["Property", "From", "Message", "Status", "Date", ""].map((h) => (
                      <th
                        key={h}
                        style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #ecf0f1", color: "#2c3e50" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleInquiries.map((inq) => (
                    <tr key={inq._id} style={{ borderBottom: "1px solid #ecf0f1" }}>
                      <td style={{ padding: "10px 12px" }}>
                        {inq.propertyId
                          ? `${inq.propertyId.street}, ${inq.propertyId.city}`
                          : "—"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <strong>{inq.name}</strong>
                        <br />
                        <span style={{ color: "#7f8c8d", fontSize: "0.8rem" }}>{inq.email}</span>
                      </td>
                      <td style={{ padding: "10px 12px", maxWidth: "220px", wordBreak: "break-word" }}>
                        {inq.message}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: `1px solid ${STATUS_COLORS[inq.status]}`,
                            color: STATUS_COLORS[inq.status],
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#7f8c8d", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <button
                          onClick={() => handleDeleteInquiry(inq._id)}
                          style={{
                            background: "#ff4d4f",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "5px 12px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* USERS TAB */}
      {tab === "users" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
            <button
              onClick={() => setShowCreateAdmin((v) => !v)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                background: showCreateAdmin ? "#95a5a6" : "#2c3e50",
                color: "#fff",
                fontSize: "0.9rem",
              }}
            >
              {showCreateAdmin ? "Cancel" : "+ Create Admin"}
            </button>
          </div>

          {showCreateAdmin && (
            <form
              onSubmit={handleCreateAdmin}
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "16px",
                padding: "16px",
                background: "#f8f9fa",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
              }}
            >
              {[
                { name: "firstName", placeholder: "First name" },
                { name: "lastName", placeholder: "Last name" },
                { name: "email", placeholder: "Email", type: "email" },
                { name: "password", placeholder: "Password (min 6)", type: "password" },
              ].map(({ name, placeholder, type = "text" }) => (
                <input
                  key={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={adminForm[name]}
                  onChange={handleAdminFormChange}
                  required
                  minLength={name === "password" ? 6 : undefined}
                  style={{
                    flex: "1 1 180px",
                    padding: "9px 12px",
                    borderRadius: "7px",
                    border: "1px solid #ddd",
                    fontSize: "0.9rem",
                  }}
                />
              ))}
              <button
                type="submit"
                disabled={creatingAdmin}
                style={{
                  padding: "9px 22px",
                  borderRadius: "7px",
                  border: "none",
                  background: "#2c3e50",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {creatingAdmin ? "Creating…" : "Create"}
              </button>
            </form>
          )}

          <input
            type="text"
            placeholder="Search by name, email or role…"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />
          {loadingUsers ? (
            <p>Loading users…</p>
          ) : visibleUsers.length === 0 ? (
            <p style={{ color: "#7f8c8d" }}>No users found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    {["Name", "Email", "Role", "Joined", ""].map((h) => (
                      <th
                        key={h}
                        style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #ecf0f1", color: "#2c3e50" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #ecf0f1" }}>
                      <td style={{ padding: "10px 12px" }}>
                        {u.firstName} {u.lastName}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#7f8c8d" }}>{u.email}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            background: u.role === "Admin" ? "#2c3e50" : "#ecf0f1",
                            color: u.role === "Admin" ? "#fff" : "#34495e",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#7f8c8d", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {u._id !== currentUser?._id && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            style={{
                              background: "#ff4d4f",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "5px 12px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AdminPanel;
