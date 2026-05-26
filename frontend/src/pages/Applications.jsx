import React, { useEffect, useState } from "react";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  function loadApplications() {
    const saved = JSON.parse(localStorage.getItem("applications") || "[]");
    setApplications(saved);
  }

  useEffect(() => {
    loadApplications();

    window.addEventListener("focus", loadApplications);

    return () => {
      window.removeEventListener("focus", loadApplications);
    };
  }, []);

  function updateStatus(id, status) {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status } : app
    );

    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));
  }

  const pending = applications.filter((a) => a.status === "pending").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  return (
    <div className="applicationsPage">
      <div className="applicationsHeader">
        <p className="label">Application board</p>
        <h1>Manage gig applications</h1>
        <p>Review submitted applications and update their status.</p>
      </div>

      <div className="applicationSummary">
        <div><span>Pending</span><strong>{pending}</strong></div>
        <div><span>Accepted</span><strong>{accepted}</strong></div>
        <div><span>Rejected</span><strong>{rejected}</strong></div>
        <div><span>Total</span><strong>{applications.length}</strong></div>
      </div>

      <div className="applicationBoard">
        {applications.length === 0 ? (
          <div className="applicationCard">
            <h2>No applications yet</h2>
            <p>Go to the Gigs page and apply to a gig first.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div className="applicationCard" key={app.id}>
              <div className="appTop">
                <div>
                  <span className="miniLabel">{app.task}</span>
                  <h2>{app.freelancer}</h2>
                  <p>{app.role}</p>
                </div>

                <span className={`statusBadge ${app.status}`}>
                  {app.status}
                </span>
              </div>

              <p className="appMessage">“{app.message}”</p>

              <div className="applicationDetails">
                <div>
                  <span>Match Score</span>
                  <strong>{app.score}%</strong>
                </div>
                <div>
                  <span>Budget</span>
                  <strong>{app.budget}</strong>
                </div>
              </div>

              <div className="appActions">
                <button onClick={() => updateStatus(app.id, "accepted")}>
                  Accept
                </button>
                <button className="rejectBtn" onClick={() => updateStatus(app.id, "rejected")}>
                  Reject
                </button>
                <button className="pendingBtn" onClick={() => updateStatus(app.id, "pending")}>
                  Mark Pending
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}