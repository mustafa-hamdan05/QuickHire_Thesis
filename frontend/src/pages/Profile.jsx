import React, { useState } from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profileKey = `profile:${user.email || "guest"}`;

  // Default profile mirrors the old static page, so first load looks identical
  const defaults = {
    headline: "Web Development",
    location: "Budapest",
    availability: "Available now",
    bio: "Motivated freelancer with experience in web development, task management, and smart digital platforms. Interested in flexible short-term gigs and modern technology projects.",
    skills: "React, JavaScript, CSS, Communication, Problem Solving",
    rating: 4.8,
    completed: 12,
    reliability: 94,
  };

  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(profileKey) || "null");
    return saved ? { ...defaults, ...saved } : defaults;
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  function startEdit() {
    setDraft(profile);
    setEditing(true);
  }

  function save() {
    setProfile(draft);
    localStorage.setItem(profileKey, JSON.stringify(draft));
    setEditing(false);
  }

  function update(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  // Profile strength = how complete the profile is (real, computed)
  const fields = [profile.headline, profile.location, profile.availability, profile.bio, profile.skills];
  const filled = fields.filter((v) => String(v || "").trim()).length + (profile.rating > 0 ? 1 : 0);
  const strength = Math.round((filled / 6) * 100);

  const skillList = String(profile.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const inputStyle = {
    width: "100%",
    border: "none",
    background: "#f5f7fb",
    borderRadius: 16,
    padding: "14px 16px",
    fontSize: 16,
    outline: "none",
    marginTop: 8,
  };

  return (
    <div className="profilePage">
      <div className="profileHero">
        <div className="profileAvatar">{(user.name || "U").charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <p className="label">My profile</p>
          <h1>{user.name || "QuickHire User"}</h1>
          <p>
            {user.role || "FREELANCER"} • {profile.headline || "—"} • {profile.location || "—"}
          </p>
          {user.email && <p style={{ color: "#94a3b8", marginTop: 4 }}>{user.email}</p>}
        </div>

        {!editing ? (
          <button className="mainBtn" onClick={startEdit}>Edit Profile</button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="mainBtn" onClick={save}>Save</button>
            <button className="outlineSmall" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="profileGrid">
          <div className="profileCard">
            <h2>About</h2>
            <p>{profile.bio}</p>
          </div>

          <div className="profileCard">
            <h2>Profile Strength</h2>
            <div className="profileScore">{strength}%</div>
            <p>
              {strength >= 100
                ? "Your profile is complete and ranking strongly."
                : "Add more details to improve your ranking and match score."}
            </p>
          </div>

          <div className="profileCard">
            <h2>Skills</h2>
            <div className="skillRow">
              {skillList.length ? (
                skillList.map((s) => <span key={s}>{s}</span>)
              ) : (
                <p style={{ color: "#94a3b8" }}>No skills added yet.</p>
              )}
            </div>
          </div>

          <div className="profileCard">
            <h2>Performance</h2>
            <div className="profileStats">
              <div><strong>{profile.rating}★</strong><span>Rating</span></div>
              <div><strong>{profile.completed}</strong><span>Completed Gigs</span></div>
              <div><strong>{profile.reliability}%</strong><span>Reliability</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="profileGrid">
          <div className="profileCard">
            <h2>Edit details</h2>

            <label style={{ fontWeight: 800 }}>Headline / focus</label>
            <input style={inputStyle} value={draft.headline} onChange={(e) => update("headline", e.target.value)} />

            <label style={{ fontWeight: 800, display: "block", marginTop: 16 }}>Location</label>
            <input style={inputStyle} value={draft.location} onChange={(e) => update("location", e.target.value)} />

            <label style={{ fontWeight: 800, display: "block", marginTop: 16 }}>Availability</label>
            <input style={inputStyle} value={draft.availability} onChange={(e) => update("availability", e.target.value)} />
          </div>

          <div className="profileCard">
            <h2>About</h2>
            <textarea
              style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
              value={draft.bio}
              onChange={(e) => update("bio", e.target.value)}
            />
          </div>

          <div className="profileCard">
            <h2>Skills</h2>
            <p style={{ color: "#667085" }}>Separate skills with commas.</p>
            <input style={inputStyle} value={draft.skills} onChange={(e) => update("skills", e.target.value)} />
          </div>

          <div className="profileCard">
            <h2>Performance</h2>
            <div className="profileStats">
              <div>
                <input
                  style={{ ...inputStyle, marginTop: 0 }}
                  type="number" step="0.1" min="0" max="5"
                  value={draft.rating}
                  onChange={(e) => update("rating", Number(e.target.value))}
                />
                <span>Rating</span>
              </div>
              <div>
                <input
                  style={{ ...inputStyle, marginTop: 0 }}
                  type="number" min="0"
                  value={draft.completed}
                  onChange={(e) => update("completed", Number(e.target.value))}
                />
                <span>Completed Gigs</span>
              </div>
              <div>
                <input
                  style={{ ...inputStyle, marginTop: 0 }}
                  type="number" min="0" max="100"
                  value={draft.reliability}
                  onChange={(e) => update("reliability", Number(e.target.value))}
                />
                <span>Reliability %</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
