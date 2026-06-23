import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

const CATEGORIES = [
  "Web Development",
  "Marketing",
  "Hospitality",
  "Design",
  "Event Staff",
  "Logistics",
];

export default function PostGig() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Web Development",
    requiredSkills: "",
    location: "",
    hourlyRate: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (user.role && user.role !== "CLIENT") {
    return (
      <div className="marketplacePage" style={{ padding: 40 }}>
        <h2>Only client accounts can post gigs.</h2>
      </div>
    );
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setError("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Please fill in at least a title and a description.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          requiredSkills: form.requiredSkills.trim(),
          location: form.location.trim() || "Remote",
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : 0,
          status: "OPEN",
        }),
      });
      if (!res.ok) throw new Error("bad response");
      alert("Gig posted successfully!");
      navigate("/tasks");
    } catch (e) {
      setError(
        "Could not post the gig. The backend may be waking up — wait ~30 seconds and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="marketplacePage"
      style={{ display: "block", maxWidth: 640, margin: "0 auto", padding: 24 }}
    >
      <p className="label">For clients</p>
      <h1>Post a new gig</h1>
      <p>Your gig will appear on the marketplace for freelancers to apply to.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Frontend Website Assistant"
        />

        <label>Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the work, expectations, and any details."
        />

        <label>Category</label>
        <select value={form.category} onChange={(e) => update("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label>Required skills (comma separated)</label>
        <input
          value={form.requiredSkills}
          onChange={(e) => update("requiredSkills", e.target.value)}
          placeholder="React, CSS, HTML"
        />

        <label>Location</label>
        <input
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Budapest or Remote"
        />

        <label>Hourly rate (€)</label>
        <input
          type="number"
          min="0"
          value={form.hourlyRate}
          onChange={(e) => update("hourlyRate", e.target.value)}
          placeholder="20"
        />

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button className="mainBtn" disabled={saving} onClick={handleSubmit}>
          {saving ? "Posting..." : "Post Gig"}
        </button>
      </div>
    </div>
  );
}