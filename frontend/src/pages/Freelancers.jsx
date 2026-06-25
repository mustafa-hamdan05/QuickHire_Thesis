import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Freelancers() {
  const [search, setSearch] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

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

              <Link
                to={`/freelancers/${f.id}`}
                className="fullBtn"
                style={{ display: "block", textAlign: "center", textDecoration: "none" }}
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
