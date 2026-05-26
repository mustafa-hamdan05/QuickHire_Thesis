import React, { useEffect, useState } from "react";
import { getApplications, updateApplicationStatus } from "../api/api";

export default function Applications() {
  const [applications, setApplications] = useState(
    JSON.parse(localStorage.getItem("applications") || "[]")
  );
  const [loading, setLoading] = useState(true);

  async function loadApplications() {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      alert("Could not load applications. Please login again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function updateStatus(id, status) {
    try {
      const updated = await updateApplicationStatus(id, status);

      setApplications(
        applications.map((app) =>
          app.id === id ? updated : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update status.");
    }
  }

  const pending = applications.filter((a) => a.status === "pending").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  if (loading) {
    return (
      <div className="applicationsPage">
        <h1>Loading applications...</h1>
      </div>
    );
  }

  return (
    <div className="applicationsPage">
      <div className="applicationsHeader">
        <p className="label">Application board</p>
        <h1>Manage gig applications</h1>
        <p>Review real applications saved in the QuickHire database.</p>
      </div>

      <div className="applicationSummary">
        <div>
          <span>Pending</span>
          <strong>{pending}</strong>
        </div>
        <div>
          <span>Accepted</span>
          <strong>{accepted}</strong>
        </div>
        <div>
          <span>Rejected</span>
          <strong>{rejected}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{applications.length}</strong>
        </div>
      </div>

      <div className="applicationBoard">
        {applications.map((app) => (
          <div className="applicationCard" key={app.id}>
            <div className="appTop">
              <div>
                <span className="miniLabel">
                  {app.task?.title || "Unknown Task"}
                </span>
                <h2>{app.freelancer?.name || "Freelancer"}</h2>
                <p>{app.freelancer?.email}</p>
              </div>

              <span className={`statusBadge ${app.status}`}>
                {app.status}
              </span>
            </div>

            <p className="appMessage">“{app.message}”</p>

            <div className="applicationDetails">
              <div>
                <span>Location</span>
                <strong>{app.task?.location || "N/A"}</strong>
              </div>
              <div>
                <span>Rate</span>
                <strong>€{app.task?.hourlyRate || 0}/hr</strong>
              </div>
            </div>

            <div className="appActions">
              <button onClick={() => updateStatus(app.id, "accepted")}>
                Accept
              </button>

              <button
                className="rejectBtn"
                onClick={() => updateStatus(app.id, "rejected")}
              >
                Reject
              </button>

              <button
                className="pendingBtn"
                onClick={() => updateStatus(app.id, "pending")}
              >
                Mark Pending
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}