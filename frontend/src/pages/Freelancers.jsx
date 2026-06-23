import React, { useState, useEffect } from "react";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Freelancers() {
  const [search, setSearch] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/users/freelancers`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (active) setFreelancers(Array.isArray(d) ? d : []); })
      .catch(() => { if (active) setFreelancers([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = freelancers.filter((f) =>
    `${f.name} ${f.role} ${f.location} ${f.skills || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const skillsOf = (f) =>
    String(f.skills || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="pageWrap">
      <div className="pageHead">
        <p className="label">Talent pool</p>
        <h1>Find skilled freelancers</h1>
        <p>Browse real registered workers by skills, location, and rating.</p>
      </div>

      <input
        className="bigSearch"
        placeholder="Search freelancer, skill, or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={{ color: "#667085" }}>Loading freelancers…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#667085" }}>No freelancers found. New sign-ups appear here automatically.</p>
      ) : (
        <div className="freelancerGrid">
          {filtered.map((f) => (
            <div className="freelancerCard" key={f.id}>
              <div className="freelancerAvatar">{(f.name || "U").charAt(0)}</div>
              <h2>{f.name}</h2>
              <p className="roleText">{f.role}</p>
              <p>{f.bio}</p>

              <div className="freelancerMeta">
                <span>📍 {f.location || "—"}</span>
                <span>⭐ {f.rating != null ? f.rating : "—"}</span>
                <span>🟢 {f.availability || "Available"}</span>
              </div>

              <div className="skillRow">
                {skillsOf(f).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <button className="fullBtn" onClick={() => setSelected(f)}>View Profile</button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "grid", placeItems: "center", zIndex: 200, padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: 28, padding: 36, maxWidth: 540, width: "100%", position: "relative", boxShadow: "0 30px 70px rgba(0,0,0,0.25)" }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{ position: "absolute", top: 18, right: 18, border: "none", background: "#f5f7fb", borderRadius: 12, width: 40, height: 40, fontSize: 20, fontWeight: 900, cursor: "pointer", color: "#0f172a" }}
              aria-label="Close"
            >
              ×
            </button>

            <div className="freelancerAvatar">{(selected.name || "U").charAt(0)}</div>
            <h2 style={{ fontSize: 34, marginBottom: 4 }}>{selected.name}</h2>
            <p className="roleText">{selected.role}</p>
            <p style={{ color: "#667085", lineHeight: 1.7, margin: "10px 0 20px" }}>{selected.bio}</p>

            <div className="freelancerMeta">
              <span>📍 {selected.location || "—"}</span>
              <span>⭐ {selected.rating != null ? selected.rating : "—"}</span>
              <span>🟢 {selected.availability || "Available"}</span>
            </div>

            <div style={{ margin: "20px 0 8px", fontWeight: 800 }}>Skills</div>
            <div className="skillRow">
              {skillsOf(selected).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <button className="mainBtn" style={{ marginTop: 26 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}