import React, { useEffect, useState } from "react";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  return Math.floor(diff / day) + "d ago";
}

export default function Applications() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isClient = user.role === "CLIENT";
  const email = (user.email || "").toLowerCase();

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  function load() {
    fetch(`${API_URL}/applications`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setAll(Array.isArray(d) ? d : []))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch (e) {
      alert("Could not update the application status. Try again in a moment.");
    }
  }

  async function withdraw(id) {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      load();
    } catch (e) {
      alert("Could not withdraw the application. Try again in a moment.");
    }
  }

  // Clients see all applications; freelancers see only their own
  const base = isClient
    ? all
    : all.filter((a) => a.freelancer && (a.freelancer.email || "").toLowerCase() === email);

  const pending = base.filter((a) => a.status === "pending").length;
  const accepted = base.filter((a) => a.status === "accepted").length;
  const rejected = base.filter((a) => a.status === "rejected").length;

  const filtered = base.filter((a) => {
    const okStatus = filter === "all" || a.status === filter;
    const hay = `${a.task ? a.task.title : ""} ${a.freelancer ? a.freelancer.name : ""}`.toLowerCase();
    const okSearch = hay.includes(search.toLowerCase());
    return okStatus && okSearch;
  });

  const tabs = [
    ["all", "All"],
    ["pending", "Pending"],
    ["accepted", "Accepted"],
    ["rejected", "Rejected"],
  ];

  const tabStyle = (active) => ({
    border: "none",
    cursor: "pointer",
    padding: "10px 18px",
    borderRadius: 999,
    fontWeight: 800,
    background: active ? "#00843d" : "#eef2f7",
    color: active ? "#fff" : "#475467",
  });

  return (
    <div className="applicationsPage">
      <div className="applicationsHeader">
        <p className="label">Application board</p>
        <h1>{isClient ? "Manage gig applications" : "My applications"}</h1>
        <p>{isClient ? "Review submitted applications and update their status." : "Track the gigs you've applied to."}</p>
      </div>

      <div className="applicationSummary">
        <div><span>Pending</span><strong>{pending}</strong></div>
        <div><span>Accepted</span><strong>{accepted}</strong></div>
        <div><span>Rejected</span><strong>{rejected}</strong></div>
        <div><span>Total</span><strong>{base.length}</strong></div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 24 }}>
        {tabs.map(([key, lbl]) => (
          <button key={key} style={tabStyle(filter === key)} onClick={() => setFilter(key)}>{lbl}</button>
        ))}
        <input
          placeholder="Search gig or applicant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginLeft: "auto", minWidth: 220, flex: "0 1 280px", height: 46, border: "none", background: "#fff", borderRadius: 14, padding: "0 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
        />
      </div>

      <div className="applicationBoard">
        {loading ? (
          <div className="applicationCard"><h2>Loading…</h2><p>Fetching applications from the database.</p></div>
        ) : filtered.length === 0 ? (
          <div className="applicationCard">
            <h2>No applications here</h2>
            <p>{base.length === 0 ? (isClient ? "No one has applied yet." : "You haven't applied to any gigs yet.") : "Nothing matches this filter."}</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div className="applicationCard" key={app.id}>
              <div className="appTop">
                <div>
                  <span className="miniLabel">{app.task ? app.task.title : "Gig"}</span>
                  <h2>{isClient ? (app.freelancer ? app.freelancer.name : "Applicant") : (app.task ? app.task.category : "Gig")}</h2>
                  <p>{timeAgo(app.createdAt)}{app.task ? ` · ${app.task.location}` : ""}</p>
                </div>

                <span className={`statusBadge ${app.status}`}>{app.status}</span>
              </div>

              <p className="appMessage">“{app.message}”</p>

              <div className="applicationDetails">
                <div>
                  <span>Category</span>
                  <strong style={{ fontSize: 20 }}>{app.task ? app.task.category : "—"}</strong>
                </div>
                <div>
                  <span>Rate</span>
                  <strong>{app.task ? `€${app.task.hourlyRate}/hr` : "—"}</strong>
                </div>
              </div>

              <div className="appActions">
                {isClient ? (
                  <>
                    <button onClick={() => updateStatus(app.id, "accepted")}>Accept</button>
                    <button className="rejectBtn" onClick={() => updateStatus(app.id, "rejected")}>Reject</button>
                    <button className="pendingBtn" onClick={() => updateStatus(app.id, "pending")}>Mark Pending</button>
                  </>
                ) : (
                  <button className="rejectBtn" onClick={() => withdraw(app.id)}>Withdraw</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}