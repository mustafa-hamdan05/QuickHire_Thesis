import React, { useEffect, useState } from "react";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

function timeAgo(iso) {
  if (!iso) return "Recently";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Recently";
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  return Math.floor(diff / day) + "d ago";
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Profile fields: prefer what was saved on the Profile page, else the account's own data
  const savedProfile = JSON.parse(localStorage.getItem(`profile:${user.email || "guest"}`) || "null") || {};
  const pSkills = savedProfile.skills ?? user.skills ?? "";
  const pBio = savedProfile.bio ?? user.bio ?? "";
  const pLocation = savedProfile.location ?? user.location ?? "";
  const pAvailability = savedProfile.availability ?? user.availability ?? "";
  const pRating = savedProfile.rating ?? user.rating ?? 0;

  // Real profile-progress numbers
  const skillCount = String(pSkills).split(",").map((s) => s.trim()).filter(Boolean).length;
  const skillsPct = Math.min(100, Math.round((skillCount / 5) * 100));
  const detailsFilled = [pBio, pLocation, pAvailability].filter((v) => String(v || "").trim()).length;
  const detailsPct = Math.round((detailsFilled / 3) * 100);
  const ratingPct = Math.round((Math.min(5, Number(pRating) || 0) / 5) * 100);
  const overallPct = Math.round((skillsPct + detailsPct + ratingPct) / 3);

  const skills = pSkills || "React, CSS, HTML";
  const location = pLocation || "";

  const [taskCount, setTaskCount] = useState(null);
  const [apps, setApps] = useState([]);

  const [recs, setRecs] = useState([]);
  const [recState, setRecState] = useState("loading"); // loading | done | error

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/tasks`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (active) setTaskCount(Array.isArray(d) ? d.length : 0); })
      .catch(() => { if (active) setTaskCount(0); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/applications`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (active) setApps(Array.isArray(d) ? d : []); })
      .catch(() => { if (active) setApps([]); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setRecState("loading");
    fetch(`${API_URL}/recommendations/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancerName: user.name || "Guest", skills, location }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => { if (active) { setRecs(Array.isArray(data) ? data : []); setRecState("done"); } })
      .catch(() => { if (active) setRecState("error"); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pending = apps.filter((a) => a.status === "pending").length;
  const accepted = apps.filter((a) => a.status === "accepted");
  const earnings = accepted.reduce((sum, a) => sum + (a.task && a.task.hourlyRate ? a.task.hourlyRate : 0), 0);

  const topMatch = recState === "done" && recs.length ? recs[0] : null;

  // Real recent-activity feed
  const email = (user.email || "").toLowerCase();
  const myApps = apps
    .filter((a) => a.freelancer && (a.freelancer.email || "").toLowerCase() === email)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const activitySource = myApps.length ? myApps : [...apps].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const activity = [];
  if (topMatch) {
    activity.push({ when: "Now", text: `Top match: ${topMatch.task ? topMatch.task.title : "a gig"} (${topMatch.score}%)` });
  }
  activitySource.slice(0, 4).forEach((a) => {
    activity.push({
      when: timeAgo(a.createdAt),
      text: `${a.freelancer ? a.freelancer.name : "Someone"} applied to ${a.task ? a.task.title : "a gig"} · ${a.status}`,
    });
  });

  return (
    <div className="dashPage">
      <div className="dashHero">
        <div>
          <p className="label">Control center</p>
          <h1>Welcome back, {user.name || "Mustafa Hamdan"}</h1>
          <p>Monitor gig activity, earnings, profile strength, and smart recommendations.</p>
        </div>

        <div className="dashHeroCard">
          <span>AI Match Health</span>
          <strong>{topMatch ? `${topMatch.score}%` : "—"}</strong>
          <p>{topMatch ? `Your top match: ${topMatch.task ? topMatch.task.title : "a gig"}` : "Generating your matches…"}</p>
        </div>
      </div>

      <div className="dashStats">
        <div className="dashStat">
          <span>Active Gigs</span>
          <strong>{taskCount === null ? "…" : taskCount}</strong>
          <small>from the live database</small>
        </div>

        <div className="dashStat">
          <span>Applications</span>
          <strong>{apps.length}</strong>
          <small>{pending} pending review</small>
        </div>

        <div className="dashStat">
          <span>Accepted</span>
          <strong>{accepted.length}</strong>
          <small>accepted applications</small>
        </div>

        <div className="dashStat">
          <span>Est. Value</span>
          <strong>€{earnings.toLocaleString()}</strong>
          <small>hourly rate of accepted gigs</small>
        </div>
      </div>

      <div className="dashboardLayout">
        <section className="dashPanel largePanel">
          <div className="panelHeader">
            <h2>Recommended gigs</h2>
            <span>AI matched</span>
          </div>

          <p style={{ color: "#667085", marginTop: -8, marginBottom: 18 }}>
            Based on your skills: {skills}
          </p>

          <div className="recommendationList">
            {recState === "loading" && (
              <div className="recommendationItem">
                <div><h3>Matching gigs to your skills…</h3><p>This can take a moment if the server was asleep.</p></div>
              </div>
            )}

            {recState === "error" && (
              <div className="recommendationItem">
                <div><h3>Couldn’t reach the matching service</h3><p>The backend may be waking up — refresh in a moment.</p></div>
              </div>
            )}

            {recState === "done" && recs.length === 0 && (
              <div className="recommendationItem">
                <div><h3>No gigs to match yet</h3><p>Post a gig, then refresh to see matches.</p></div>
              </div>
            )}

            {recState === "done" && recs.map((rec) => (
              <div className="recommendationItem" key={rec.id}>
                <div>
                  <h3>{rec.task ? rec.task.title : "Gig"}</h3>
                  <p>{rec.reason}</p>
                </div>
                <strong>{rec.score}%</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dashPanel">
          <div className="panelHeader">
            <h2>Profile progress</h2>
            <span>{overallPct}%</span>
          </div>

          <div className="progressBox">
            <p>Skills added ({skillCount})</p>
            <div className="progressLine"><div style={{ width: `${skillsPct}%` }}></div></div>
          </div>

          <div className="progressBox">
            <p>Profile details</p>
            <div className="progressLine"><div style={{ width: `${detailsPct}%` }}></div></div>
          </div>

          <div className="progressBox">
            <p>Rating</p>
            <div className="progressLine"><div style={{ width: `${ratingPct}%` }}></div></div>
          </div>
        </section>

        <section className="dashPanel">
          <div className="panelHeader">
            <h2>Recent activity</h2>
            <span>Live</span>
          </div>

          <div className="activityList">
            {activity.length === 0 ? (
              <p>No recent activity yet — apply to a gig to get started.</p>
            ) : (
              activity.map((a, i) => (
                <p key={i}><b>{a.when}:</b> {a.text}</p>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}