import React, { useEffect, useState } from "react";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // NEW: live count of gigs from the backend
  const [taskCount, setTaskCount] = useState(null);

  // NEW: real application data from localStorage
  const apps = JSON.parse(localStorage.getItem("applications") || "[]");
  const pending = apps.filter((a) => a.status === "pending").length;
  const accepted = apps.filter((a) => a.status === "accepted");
  const earnings = accepted.reduce((sum, a) => {
    const n = parseInt(String(a.budget).replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/tasks`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setTaskCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => {
        if (active) setTaskCount(0);
      });
    return () => {
      active = false;
    };
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
            <strong>€{earnings.toLocaleString()}</strong>
            <small>from accepted gigs</small>
          </div>
        </div>

        <div className="dashboardLayout">
          <section className="dashPanel largePanel">
            <div className="panelHeader">
              <h2>Recommended gigs</h2>
              <span>Smart ranking</span>
            </div>

            <div className="recommendationList">
              <div className="recommendationItem">
                <div>
                  <h3>Frontend Website Assistant</h3>
                  <p>React • CSS • Budapest • Today</p>
                </div>
                <strong>96%</strong>
              </div>

              <div className="recommendationItem">
                <div>
                  <h3>UI Design Assistant</h3>
                  <p>Figma • UX • Remote • This week</p>
                </div>
                <strong>92%</strong>
              </div>

              <div className="recommendationItem">
                <div>
                  <h3>Customer Support Agent</h3>
                  <p>English • Remote • Part-time</p>
                </div>
                <strong>84%</strong>
              </div>
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
