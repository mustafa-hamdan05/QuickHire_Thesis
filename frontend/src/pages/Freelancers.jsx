import React, { useState } from "react";

export default function Freelancers() {
  const [search, setSearch] = useState("");

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

              <button className="fullBtn">View Profile</button>
            </div>
          ))}
        </div>
      </div>
  );
}