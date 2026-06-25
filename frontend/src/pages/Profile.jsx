import React, { useEffect, useState } from "react";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(stored);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(stored);
  const [saving, setSaving] = useState(false);

  const [appCount, setAppCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  useEffect(() => {
    const email = (user.email || "").toLowerCase();
    fetch(`${API_URL}/applications`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        const mine = (Array.isArray(d) ? d : []).filter(
          (a) => a.freelancer && (a.freelancer.email || "").toLowerCase() === email
        );
        setAppCount(mine.length);
        setAcceptedCount(mine.filter((a) => a.status === "accepted").length);
      })
      .catch(() => {});
  }, [user.email]);

  function startEdit() {
    setDraft(user);
    setEditing(true);
  }
  function update(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: draft.bio || "",
          skills: draft.skills || "",
          availability: draft.availability || "",
          location: draft.location || "",
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      localStorage.setItem(`profile:${updated.email}`, JSON.stringify({
        skills: updated.skills, bio: updated.bio, location: updated.location,
        availability: updated.availability, rating: updated.rating,
      }));
      setEditing(false);
    } catch (e) {
      alert("Could not save your profile. The server may be waking up — try again.");
    } finally {
      setSaving(false);
    }
  }

  const fields = [user.bio, user.skills, user.location, user.availability];
  const filled = fields.filter((v) => String(v || "").trim()).length + ((Number(user.rating) || 0) > 0 ? 1 : 0);
  const strength = Math.round((filled / 5) * 100);
  const skillList = String(user.skills || "").split(",").map((s) => s.trim()).filter(Boolean);

  const inputStyle = {
    width: "100%", border: "none", background: "#f5f7fb", borderRadius: 16,
    padding: "14px 16px", fontSize: 16, outline: "none", marginTop: 8,
  };

  return (
    <div className="profilePage">
      <div className="profileHero">
        <div className="profileAvatar">{(user.name || "U").charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <p className="label">My profile</p>
          <h1>{user.name || "QuickHire User"}</h1>
          <p>{user.role || "FREELANCER"} • {user.location || "—"} • {user.availability || "Available"}</p>
          {user.email && <p style={{ color: "#94a3b8", marginTop: 4 }}>{user.email}</p>}
        </div>

        {!editing ? (
          <button className="mainBtn" onClick={startEdit}>Edit Profile</button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="mainBtn" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save"}</button>
            <button className="outlineSmall" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="profileGrid">
          <div className="profileCard">
            <h2>About</h2>
            <p>{user.bio || "No bio yet. Click Edit Profile to add one."}</p>
          </div>

          <div className="profileCard">
            <h2>Profile Strength</h2>
            <div className="profileScore">{strength}%</div>
            <p>{strength >= 100 ? "Your profile is complete and ranking strongly." : "Add more details to improve your ranking and match score."}</p>
          </div>

          <div className="profileCard">
            <h2>Skills</h2>
            <div className="skillRow">
              {skillList.length ? skillList.map((s) => <span key={s}>{s}</span>) : <p style={{ color: "#94a3b8" }}>No skills added yet.</p>}
            </div>
          </div>

          <div className="profileCard">
            <h2>Performance</h2>
            <div className="profileStats">
              <div><strong>{user.rating != null ? user.rating : "—"}★</strong><span>Rating</span></div>
              <div><strong>{appCount}</strong><span>Applications</span></div>
              <div><strong>{acceptedCount}</strong><span>Accepted</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="profileGrid">
          <div className="profileCard">
            <h2>Edit details</h2>

            <label style={{ fontWeight: 800 }}>Location</label>
            <input style={inputStyle} value={draft.location || ""} onChange={(e) => update("location", e.target.value)} />

            <label style={{ fontWeight: 800, display: "block", marginTop: 16 }}>Availability</label>
            <input style={inputStyle} value={draft.availability || ""} onChange={(e) => update("availability", e.target.value)} />
          </div>

          <div className="profileCard">
            <h2>About</h2>
            <textarea
              style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
              value={draft.bio || ""}
              onChange={(e) => update("bio", e.target.value)}
            />
          </div>

          <div className="profileCard">
            <h2>Skills</h2>
            <p style={{ color: "#667085" }}>Separate skills with commas.</p>
            <input style={inputStyle} value={draft.skills || ""} onChange={(e) => update("skills", e.target.value)} />
          </div>

          <div className="profileCard">
            <h2>Performance</h2>
            <p style={{ color: "#667085" }}>Rating and history update automatically from your activity.</p>
            <div className="profileStats" style={{ marginTop: 12 }}>
              <div><strong>{user.rating != null ? user.rating : "—"}★</strong><span>Rating</span></div>
              <div><strong>{appCount}</strong><span>Applications</span></div>
              <div><strong>{acceptedCount}</strong><span>Accepted</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}