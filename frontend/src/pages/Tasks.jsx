import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dbTasks, setDbTasks] = useState([]);
  const [details, setDetails] = useState(null); // NEW: which gig's details modal is open

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // NEW: titles the user has already applied to (so we can show "Applied" and block duplicates)
  const [appliedTitles, setAppliedTitles] = useState(() => {
    const apps = JSON.parse(localStorage.getItem("applications") || "[]");
    return new Set(apps.map((a) => a.task));
  });

  const demoTasks = [
    { id: 1, title: "Frontend Website Assistant", description: "Help improve a company landing page using React and CSS.", category: "Web Development", budget: 220, location: "Budapest", deadline: "Today", skills: "React, CSS, HTML", matchScore: 94 },
    { id: 2, title: "Backend API Support", description: "Assist with REST API testing and small backend fixes.", category: "Web Development", budget: 260, location: "Remote", deadline: "This week", skills: "Java, Spring Boot, APIs", matchScore: 91 },
    { id: 3, title: "Website Bug Fixer", description: "Fix layout bugs and improve responsive design.", category: "Web Development", budget: 180, location: "Remote", deadline: "Tomorrow", skills: "JavaScript, CSS, Debugging", matchScore: 89 },
    { id: 4, title: "Event Registration Staff", description: "Support check-in and guest registration for a business event.", category: "Event Staff", budget: 150, location: "Debrecen", deadline: "Tomorrow", skills: "Communication, Organization", matchScore: 87 },
    { id: 5, title: "Conference Assistant", description: "Help guests, prepare badges, and guide attendees during a conference.", category: "Event Staff", budget: 170, location: "Budapest", deadline: "Friday", skills: "Events, English, Customer Service", matchScore: 85 },
    { id: 6, title: "Catering Support Worker", description: "Assist catering team with serving and preparation during an event.", category: "Hospitality", budget: 135, location: "Szeged", deadline: "Weekend", skills: "Hospitality, Teamwork, Service", matchScore: 83 },
    { id: 7, title: "Hotel Reception Support", description: "Part-time reception support for check-ins and guest communication.", category: "Hospitality", budget: 190, location: "Budapest", deadline: "Next week", skills: "English, Communication, Hospitality", matchScore: 90 },
    { id: 8, title: "Warehouse Packing Assistant", description: "Help organize, pack, and label products in a warehouse.", category: "Logistics", budget: 160, location: "Debrecen", deadline: "Today", skills: "Warehouse, Packing, Reliability", matchScore: 82 },
    { id: 9, title: "Delivery Helper", description: "Assist with local deliveries and package handling.", category: "Logistics", budget: 145, location: "Budapest", deadline: "Tomorrow", skills: "Delivery, Time Management, Physical Work", matchScore: 80 },
    { id: 10, title: "Social Media Assistant", description: "Create short posts and schedule content for a small business.", category: "Marketing", budget: 210, location: "Remote", deadline: "This week", skills: "Social Media, Writing, Canva", matchScore: 88 },
    { id: 11, title: "Brand Promotion Staff", description: "Promote a local product at a student event.", category: "Marketing", budget: 155, location: "Debrecen", deadline: "Saturday", skills: "Marketing, Communication, Sales", matchScore: 84 },
    { id: 12, title: "Poster Designer", description: "Design a clean promotional poster for an upcoming event.", category: "Design", budget: 120, location: "Remote", deadline: "3 days", skills: "Design, Canva, Creativity", matchScore: 86 },
    { id: 13, title: "UI Design Assistant", description: "Help redesign dashboard cards and page layouts.", category: "Design", budget: 240, location: "Remote", deadline: "Next week", skills: "UI Design, Figma, UX", matchScore: 92 },
  ];

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/tasks`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!active) return;
        const mapped = (Array.isArray(data) ? data : []).map((t) => ({
          id: `db-${t.id}`,
          title: t.title,
          description: t.description,
          category: t.category || "Other",
          budget: t.hourlyRate ?? 0,
          location: t.location || "Remote",
          deadline: "Open",
          skills: t.requiredSkills || "",
          matchScore: null,
        }));
        setDbTasks(mapped);
      })
      .catch(() => {
        // backend asleep or CORS not deployed yet — keep demo gigs only
      });
    return () => {
      active = false;
    };
  }, []);

  const allTasks = [...dbTasks, ...demoTasks];

  function handleApply(taskId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login first.");
      return;
    }
    const selectedTask = allTasks.find((task) => task.id === taskId);
    if (!selectedTask) return;

    // NEW: block duplicate applications
    if (appliedTitles.has(selectedTask.title)) {
      alert("You already applied to this gig.");
      return;
    }

    const existingApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    const newApplication = {
      id: Date.now(),
      task: selectedTask.title,
      freelancer: JSON.parse(localStorage.getItem("user") || "{}").name || "QuickHire User",
      role: "Applicant",
      message: "I am interested in this opportunity.",
      status: "pending",
      score: selectedTask.matchScore, // may be null for real DB gigs — handled on the Applications page
      budget: `€${selectedTask.budget}`,
    };
    localStorage.setItem("applications", JSON.stringify([...existingApplications, newApplication]));

    // NEW: update applied state so the button flips to "Applied"
    setAppliedTitles((prev) => new Set(prev).add(selectedTask.title));
    alert("Application submitted successfully!");
  }

  const filteredTasks = allTasks.filter((task) => {
    const text = `${task.title} ${task.description} ${task.skills} ${task.location}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesCategory = category === "All" || task.category === category;
    return matchesSearch && matchesCategory;
  });

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
            {user.role === "CLIENT" && (
              <Link to="/post-gig" className="mainBtn">+ Post a Gig</Link>
            )}
            <span>{filteredTasks.length} results</span>
          </div>
        </div>

        <div className="gigList">
          {filteredTasks.map((task) => {
            const isApplied = appliedTitles.has(task.title);
            return (
              <div className="gigCardNew" key={task.id}>
                <div className="gigTop">
                  <div>
                    <span className="gigCategory">{task.category}</span>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>

                  <div className="gigPay">
                    <strong>€{task.budget}</strong>
                    <span>budget</span>
                  </div>
                </div>

                <div className="gigMeta">
                  <span>📍 {task.location}</span>
                  <span>🕒 {task.deadline}</span>
                  {task.matchScore != null && <span>⭐ Match score: {task.matchScore}%</span>}
                </div>

                <div className="skillRow">
                  {(task.skills || "")
                    .split(",")
                    .filter((s) => s.trim())
                    .map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                </div>

                <div className="gigActions">
                  <button
                    onClick={() => handleApply(task.id)}
                    disabled={isApplied}
                    style={isApplied ? { background: "#94a3b8", cursor: "default" } : undefined}
                  >
                    {isApplied ? "Applied ✓" : "Apply Now"}
                  </button>
                  <button className="outlineSmall" onClick={() => setDetails(task)}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* NEW: gig details modal */}
      {details && (
        <div
          onClick={() => setDetails(null)}
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
              maxWidth: 560,
              width: "100%",
              position: "relative",
              boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
            }}
          >
            <button
              onClick={() => setDetails(null)}
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

            <span className="gigCategory">{details.category}</span>
            <h2 style={{ fontSize: 32, margin: "6px 0 12px" }}>{details.title}</h2>
            <p style={{ color: "#667085", lineHeight: 1.7 }}>{details.description}</p>

            <div className="gigMeta" style={{ marginTop: 20 }}>
              <span>📍 {details.location}</span>
              <span>🕒 {details.deadline}</span>
              <span>💶 €{details.budget} budget</span>
              {details.matchScore != null && <span>⭐ {details.matchScore}% match</span>}
            </div>

            <div style={{ margin: "20px 0 8px", fontWeight: 800 }}>Required skills</div>
            <div className="skillRow">
              {(details.skills || "")
                .split(",")
                .filter((s) => s.trim())
                .map((skill, index) => (
                  <span key={index}>{skill.trim()}</span>
                ))}
            </div>

            <div className="gigActions" style={{ marginTop: 26 }}>
              <button
                onClick={() => {
                  handleApply(details.id);
                  setDetails(null);
                }}
                disabled={appliedTitles.has(details.title)}
                style={
                  appliedTitles.has(details.title)
                    ? { background: "#94a3b8", cursor: "default" }
                    : undefined
                }
              >
                {appliedTitles.has(details.title) ? "Applied ✓" : "Apply Now"}
              </button>
              <button className="outlineSmall" onClick={() => setDetails(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
