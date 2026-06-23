import React, { useState } from "react";

export default function Freelancers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // NEW: which freelancer's profile is open

  const freelancers = [
    {
      name: "Sara Ahmed",
      role: "Frontend Developer",
      location: "Budapest",
      rating: "4.9",
      skills: ["React", "CSS", "JavaScript"],
      bio: "Builds clean landing pages and dashboards for modern web apps.",
      score: 96
    },
    {
      name: "Daniel Kovacs",
      role: "Event Staff",
      location: "Debrecen",
      rating: "4.7",
      skills: ["Communication", "Events", "Customer Service"],
      bio: "Reliable short-term worker for events, registration, and support.",
      score: 89
    },
    {
      name: "Mira Hassan",
      role: "Support Specialist",
      location: "Remote",
      rating: "4.8",
      skills: ["English", "Support", "Scheduling"],
      bio: "Experienced in online support, admin tasks, and client communication.",
      score: 92
    },
    {
      name: "Adam Nagy",
      role: "Backend Assistant",
      location: "Budapest",
      rating: "4.6",
      skills: ["Java", "Spring Boot", "SQL"],
      bio: "Supports backend API development, database work, and testing.",
      score: 90
    },
    {
      name: "Leila Omar",
      role: "UI Designer",
      location: "Remote",
      rating: "4.9",
      skills: ["Figma", "UI Design", "Canva"],
      bio: "Creates clean interfaces, posters, and modern visual designs.",
      score: 94
    },
    {
      name: "Bence Toth",
      role: "Warehouse Assistant",
      location: "Debrecen",
      rating: "4.5",
      skills: ["Packing", "Logistics", "Reliability"],
      bio: "Available for warehouse, delivery, and packing support tasks.",
      score: 84
    },
    {
      name: "Nora Farkas",
      role: "Marketing Assistant",
      location: "Remote",
      rating: "4.7",
      skills: ["Social Media", "Writing", "Branding"],
      bio: "Helps small businesses with content planning and online promotion.",
      score: 88
    },
    {
      name: "Karim Youssef",
      role: "Hospitality Worker",
      location: "Szeged",
      rating: "4.6",
      skills: ["Hospitality", "Teamwork", "Service"],
      bio: "Experienced in serving, catering support, and hotel guest assistance.",
      score: 86
    }
  ];

  const filtered = freelancers.filter((f) =>
    `${f.name} ${f.role} ${f.location} ${f.skills.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
      <div className="pageWrap">
        <div className="pageHead">
          <p className="label">Talent pool</p>
          <h1>Find skilled freelancers</h1>
          <p>Browse workers by skills, availability, rating, and match score.</p>
        </div>

        <input
          className="bigSearch"
          placeholder="Search freelancer, skill, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="freelancerGrid">
          {filtered.map((f, index) => (
            <div className="freelancerCard" key={index}>
              <div className="freelancerAvatar">{f.name.charAt(0)}</div>
              <h2>{f.name}</h2>
              <p className="roleText">{f.role}</p>
              <p>{f.bio}</p>

              <div className="freelancerMeta">
                <span>📍 {f.location}</span>
                <span>⭐ {f.rating}</span>
                <span>🎯 {f.score}% match</span>
              </div>

              <div className="skillRow">
                {f.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              {/* NEW: View Profile now opens a modal */}
              <button className="fullBtn" onClick={() => setSelected(f)}>
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* NEW: Profile modal */}
        {selected && (
          <div
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.55)",
              display: "grid",
              placeItems: "center",
              zIndex: 200,
              padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 28,
                padding: 36,
                maxWidth: 540,
                width: "100%",
                position: "relative",
                boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  border: "none",
                  background: "#f5f7fb",
                  borderRadius: 12,
                  width: 40,
                  height: 40,
                  fontSize: 20,
                  fontWeight: 900,
                  cursor: "pointer",
                  color: "#0f172a",
                }}
                aria-label="Close"
              >
                ×
              </button>

              <div className="freelancerAvatar">{selected.name.charAt(0)}</div>
              <h2 style={{ fontSize: 34, marginBottom: 4 }}>{selected.name}</h2>
              <p className="roleText">{selected.role}</p>
              <p style={{ color: "#667085", lineHeight: 1.7, margin: "10px 0 20px" }}>
                {selected.bio}
              </p>

              <div className="freelancerMeta">
                <span>📍 {selected.location}</span>
                <span>⭐ {selected.rating}</span>
                <span>🎯 {selected.score}% match</span>
              </div>

              <div style={{ margin: "20px 0 8px", fontWeight: 800 }}>Skills</div>
              <div className="skillRow">
                {selected.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <button
                className="mainBtn"
                style={{ marginTop: 26 }}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
  );
}
