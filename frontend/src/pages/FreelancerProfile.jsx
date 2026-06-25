import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

const skillsOf = (csv) =>
  String(csv || "").split(",").map((s) => s.trim()).filter(Boolean);

export default function FreelancerProfile() {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    fetch(`${API_URL}/users/freelancers`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (!active) return;
        const list = Array.isArray(d) ? d : [];
        const f = list.find((x) => String(x.id) === String(id));
        if (f) setFreelancer(f);
        else setNotFound(true);
      })
      .catch(() => { if (active) setNotFound(true); })
      .finally(() => { if (active) setLoading(false); });

    fetch(`${API_URL}/tasks`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (active) setGigs(Array.isArray(d) ? d : []); })
      .catch(() => {});

    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="pageWrap">
        <p style={{ color: "#667085" }}>Loading profile…</p>
      </div>
    );
  }

  if (notFound || !freelancer) {
    return (
      <div className="pageWrap">
        <div className="pageHead">
          <h1>Freelancer not found</h1>
          <p>This profile may have been removed, or the server is still waking up.</p>
        </div>
        <Link to="/freelancers" className="mainBtn">← Back to talent pool</Link>
      </div>
    );
  }

  const fSkills = skillsOf(freelancer.skills);
  const fSet = new Set(fSkills.map((s) => s.toLowerCase()));

  const matchingGigs = gigs
    .map((g) => {
      const req = skillsOf(g.requiredSkills);
      const shared = req.filter((s) => fSet.has(s.toLowerCase()));
      return { g, shared };
    })
    .filter((x) => x.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length)
    .slice(0, 3);

  const firstName = (freelancer.name || "").split(" ")[0] || "this freelancer";

  return (
    <div className="pageWrap">
      <Link to="/freelancers" className="backLink">← Back to talent pool</Link>

      <div className="profileHero">
        <div className="profileHeroAvatar">{(freelancer.name || "U").charAt(0)}</div>

        <div className="profileHeroInfo">
          <h1>{freelancer.name}</h1>
          <p className="roleText">{freelancer.role}</p>
          <div className="profileChips">
            <span>📍 {freelancer.location || "—"}</span>
            <span>⭐ {freelancer.rating != null ? freelancer.rating : "—"} rating</span>
            <span>🟢 {freelancer.availability || "Available"}</span>
          </div>
        </div>

        <div className="profileHeroActions">
          <Link to="/tasks" className="mainBtn">Browse open gigs</Link>
        </div>
      </div>

      <div className="profileStats">
        <div><strong>{freelancer.rating != null ? freelancer.rating : "—"}</strong><span>Rating</span></div>
        <div><strong>{fSkills.length}</strong><span>Skills</span></div>
        <div><strong>{freelancer.availability || "—"}</strong><span>Availability</span></div>
        <div><strong>{freelancer.location || "—"}</strong><span>Location</span></div>
      </div>

      <div className="profileGrid">
        <div className="profileMain">
          <div className="profileCard">
            <h2>About</h2>
            <p>{freelancer.bio || "This freelancer hasn't added a bio yet."}</p>
          </div>

          <div className="profileCard">
            <h2>Skills</h2>
            {fSkills.length ? (
              <div className="skillRow">
                {fSkills.map((s) => <span key={s}>{s}</span>)}
              </div>
            ) : (
              <p style={{ color: "#667085" }}>No skills listed yet.</p>
            )}
          </div>
        </div>

        <div className="profileSide">
          <div className="profileCard">
            <h2>Gigs matching {firstName}</h2>
            {matchingGigs.length === 0 ? (
              <p style={{ color: "#667085" }}>No open gigs match these skills right now.</p>
            ) : (
              <div className="matchList">
                {matchingGigs.map(({ g, shared }) => (
                  <Link to="/tasks" className="matchItem" key={g.id}>
                    <div className="matchTop">
                      <strong>{g.title}</strong>
                      <span className="matchBadge">
                        {shared.length} skill{shared.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p>{g.category} • {g.location} • €{g.hourlyRate}/hr</p>
                    <div className="skillRow small">
                      {shared.map((s) => <span key={s}>{s}</span>)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
