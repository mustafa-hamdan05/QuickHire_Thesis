import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
            <strong>8</strong>
            <small>+3 this week</small>
          </div>

          <div className="dashStat">
            <span>Applications</span>
            <strong>14</strong>
            <small>6 pending review</small>
          </div>

          <div className="dashStat">
            <span>Completed</span>
            <strong>21</strong>
            <small>92% success rate</small>
          </div>

          <div className="dashStat">
            <span>Earnings</span>
            <strong>€1,240</strong>
            <small>Estimated monthly</small>
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