import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Tasks() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "All");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [details, setDetails] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isClient = user.role === "CLIENT";

  // Load gigs from the database
  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/tasks`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (active) setTasks(Array.isArray(d) ? d : []); })
      .catch(() => { if (active) setTasks([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // Mark gigs the logged-in user already applied to (safe matching)
  function refreshApplied() {
    const email = (user.email || "").toLowerCase();
    if (!email) return;
    fetch(`${API_URL}/applications`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        const ids = (Array.isArray(list) ? list : [])
          .filter((a) => a.freelancer && (a.freelancer.email || "").toLowerCase() === email)
          .map((a) => (a.task ? a.task.id : null))
          .filter((id) => id != null);
        setAppliedIds(new Set(ids));
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.email]);

  async function handleApply(task) {
    if (isClient) {
      alert("You're signed in as a client. Log in as a freelancer to apply to gigs.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token || !user.email) {
      alert("Please log in as a freelancer to apply.");
      return;
    }
    if (appliedIds.has(task.id)) {
      alert("You already applied to this gig.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          freelancerEmail: user.email,
          message: "I am interested in this opportunity.",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }
      setAppliedIds((prev) => new Set(prev).add(task.id));
      alert("Application submitted successfully!");
    } catch (e) {
      alert("Could not submit the application: " + (e.message || "unknown error"));
    }
  }

  const filtered = tasks.filter((t) => {
    const text = `${t.title} ${t.description} ${t.requiredSkills} ${t.location}`.toLowerCase();
    const okSearch = text.includes(search.toLowerCase());
    const okCat = category === "All" || t.category === category;
    return okSearch && okCat;
  });

  function ApplyButton({ task }) {
    if (isClient) return null; // clients don't apply
    const isApplied = appliedIds.has(task.id);
    return (
      <button
        onClick={() => handleApply(task)}
        disabled={isApplied}
        style={isApplied ? { background: "#94a3b8", cursor: "default" } : undefined}
      >
        {isApplied ? "Applied ✓" : "Apply Now"}
      </button>
    );
  }

  return (
    <div className="marketplacePage">
      <aside className="filterSidebar">
        <h2>Find Gigs</h2>
        <p>Search short-term freelance opportunities.</p>

        <label>Search</label>
        <input
          placeholder="Search skills, title, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          <option>Web Development</option>
          <option>Event Staff</option>
          <option>Hospitality</option>
          <option>Logistics</option>
          <option>Marketing</option>
          <option>Design</option>
        </select>

        <div className="filterBox">
          <strong>Smart Matching</strong>
          <p>Gigs are ranked using skills, availability, location, rating, and worker performance.</p>
        </div>
      </aside>

      <main className="gigResults">
        <div className="marketHeader">
          <div>
            <p className="label">Gig marketplace</p>
            <h1>Available freelance gigs</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isClient && (
              <Link to="/post-gig" className="mainBtn">+ Post a Gig</Link>
            )}
            <span>{filtered.length} results</span>
          </div>
        </div>

        <div className="gigList">
          {loading && (
            <div className="gigCardNew"><h3>Loading gigs…</h3><p>The server may take a moment if it was asleep.</p></div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="gigCardNew"><h3>No gigs found</h3><p>Try a different search or category.</p></div>
          )}

          {!loading && filtered.map((task) => (
            <div className="gigCardNew" key={task.id}>
              <div className="gigTop">
                <div>
                  <span className="gigCategory">{task.category}</span>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>

                <div className="gigPay">
                  <strong>€{task.hourlyRate}</strong>
                  <span>per hour</span>
                </div>
              </div>

              <div className="gigMeta">
                <span>📍 {task.location}</span>
                <span>🕒 {task.status || "Open"}</span>
              </div>

              <div className="skillRow">
                {(task.requiredSkills || "")
                  .split(",")
                  .filter((s) => s.trim())
                  .map((skill, index) => (
                    <span key={index}>{skill.trim()}</span>
                  ))}
              </div>

              <div className="gigActions">
                <ApplyButton task={task} />
                <button className="outlineSmall" onClick={() => setDetails(task)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {details && (
        <div
          onClick={() => setDetails(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "grid", placeItems: "center", zIndex: 200, padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: 28, padding: 36, maxWidth: 560, width: "100%", position: "relative", boxShadow: "0 30px 70px rgba(0,0,0,0.25)" }}
          >
            <button
              onClick={() => setDetails(null)}
              style={{ position: "absolute", top: 18, right: 18, border: "none", background: "#f5f7fb", borderRadius: 12, width: 40, height: 40, fontSize: 20, fontWeight: 900, cursor: "pointer", color: "#0f172a" }}
              aria-label="Close"
            >
              ×
            </button>

            <span className="gigCategory">{details.category}</span>
            <h2 style={{ fontSize: 32, margin: "6px 0 12px" }}>{details.title}</h2>
            <p style={{ color: "#667085", lineHeight: 1.7 }}>{details.description}</p>

            <div className="gigMeta" style={{ marginTop: 20 }}>
              <span>📍 {details.location}</span>
              <span>💶 €{details.hourlyRate}/hr</span>
              <span>🕒 {details.status || "Open"}</span>
            </div>

            <div style={{ margin: "20px 0 8px", fontWeight: 800 }}>Required skills</div>
            <div className="skillRow">
              {(details.requiredSkills || "")
                .split(",")
                .filter((s) => s.trim())
                .map((skill, index) => (
                  <span key={index}>{skill.trim()}</span>
                ))}
            </div>

            <div className="gigActions" style={{ marginTop: 26 }}>
              {!isClient && (
                <button
                  onClick={() => { handleApply(details); setDetails(null); }}
                  disabled={appliedIds.has(details.id)}
                  style={appliedIds.has(details.id) ? { background: "#94a3b8", cursor: "default" } : undefined}
                >
                  {appliedIds.has(details.id) ? "Applied ✓" : "Apply Now"}
                </button>
              )}
              <button className="outlineSmall" onClick={() => setDetails(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}