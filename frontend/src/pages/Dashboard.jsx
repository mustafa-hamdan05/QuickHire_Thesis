import React, { useEffect, useState } from "react";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Pull the skills/location the user saved on their Profile page
  const profile = JSON.parse(
    localStorage.getItem(`profile:${user.email || "guest"}`) || "null"
  );
  const skills = profile && profile.skills ? profile.skills : "React, CSS, HTML";
  const location = profile && profile.location ? profile.location : "";

  // Live gig count
  const [taskCount, setTaskCount] = useState(null);

  // Real application data from localStorage
  const apps = JSON.parse(localStorage.getItem("applications") || "[]");
  const pending = apps.filter((a) => a.status === "pending").length;
  const accepted = apps.filter((a) => a.status === "accepted");
  const earnings = accepted.reduce((sum, a) => {
    const n = parseInt(String(a.budget).replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  // Recommendations from the matching engine
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
    setRecState("loading");
    fetch(`${API_URL}/recommendations/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        freelancerName: user.name || "Guest",
        skills,
        location,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!active) return;
        setRecs(Array.isArray(data) ? data : []);
        setRecState("done");
      })
      .catch(() => { if (active) setRecState("error"); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashPage">
      <div className="dashHero">
        <div>
          <p className="label">Control center</p>
          <h1>Welcome back, {user.name || "Mustafa Hamdan"}</h1>
          <p>
            Monitor gig activity, earnings, profile strength, and smart recommendations.
          </p>
        </div>

        <div className="dashHeroCard">
          <span>AI Match Health</span>
          <strong>94%</strong>
          <p>Your profile is performing strongly this week.</p>
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
          <span>Earnings</span>
          <strong>&euro;{earnings.toLocaleString()}</strong>
          <small>from accepted gigs</small>
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
                <div>
                  <h3>Matching gigs to your skills…</h3>
                  <p>This can take a moment if the server was asleep.</p>
                </div>
              </div>
            )}

            {recState === "error" && (
              <div className="recommendationItem">
                <div>
                  <h3>Couldn’t reach the matching service</h3>
                  <p>The backend may be waking up — refresh in a moment.</p>
                </div>
              </div>
            )}

            {recState === "done" && recs.length === 0 && (
              <div className="recommendationItem">
                <div>
                  <h3>No gigs to match yet</h3>
                  <p>Post a gig, then refresh to see matches.</p>
                </div>
              </div>
            )}

            {recState === "done" &&
              recs.map((rec) => (
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
            <span>86%</span>
          </div>

          <div className="progressBox">
            <p>Skills added</p>
            <div className="progressLine"><div style={{ width: "90%" }}></div></div>
          </div>

          <div className="progressBox">
            <p>Availability</p>
            <div className="progressLine"><div style={{ width: "78%" }}></div></div>
          </div>

          <div className="progressBox">
            <p>Verification</p>
            <div className="progressLine"><div style={{ width: "65%" }}></div></div>
          </div>
        </section>

        <section className="dashPanel">
          <div className="panelHeader">
            <h2>Weekly activity</h2>
            <span>Live</span>
          </div>

          <div className="activityList">
            <p><b>Today:</b> 2 new gig matches</p>
            <p><b>Yesterday:</b> Application accepted</p>
            <p><b>Monday:</b> Profile score increased</p>
            <p><b>Sunday:</b> New freelancer joined your category</p>
          </div>
        </section>
      </div>
    </div>
  );
}