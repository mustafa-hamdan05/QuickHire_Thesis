import React, { useEffect, useState } from "react";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch(`${API_URL}/applications`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setApplications(Array.isArray(d) ? d : []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch (e) {
      alert("Could not update the application status. Try again in a moment.");
    }
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
        {loading ? (
          <div className="applicationCard"><h2>Loading…</h2><p>Fetching applications from the database.</p></div>
        ) : applications.length === 0 ? (
          <div className="applicationCard">
            <h2>No applications yet</h2>
            <p>Go to the Gigs page and apply to a gig first.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div className="applicationCard" key={app.id}>
              <div className="appTop">
                <div>
                  <span className="miniLabel">{app.task ? app.task.title : "Gig"}</span>
                  <h2>{app.freelancer ? app.freelancer.name : "Applicant"}</h2>
                  <p>{app.task ? app.task.category : ""}</p>
                </div>

                <span className={`statusBadge ${app.status}`}>{app.status}</span>
              </div>

              <p className="appMessage">“{app.message}”</p>

              <div className="applicationDetails">
                <div>
                  <span>Location</span>
                  <strong style={{ fontSize: 20 }}>{app.task ? app.task.location : "—"}</strong>
                </div>
                <div>
                  <span>Rate</span>
                  <strong>{app.task ? `€${app.task.hourlyRate}/hr` : "—"}</strong>
                </div>
              </div>

              <div className="appActions">
                <button onClick={() => updateStatus(app.id, "accepted")}>Accept</button>
                <button className="rejectBtn" onClick={() => updateStatus(app.id, "rejected")}>Reject</button>
                <button className="pendingBtn" onClick={() => updateStatus(app.id, "pending")}>Mark Pending</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}