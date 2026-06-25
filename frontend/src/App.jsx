import React, { useState, useEffect, useLayoutEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import FreelancerProfile from "./pages/FreelancerProfile.jsx";

import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Freelancers from "./pages/Freelancers.jsx";
import Applications from "./pages/Applications.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostGig from "./pages/PostGig.jsx";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

const CATEGORIES = [
  { title: "Web Development", icon: "💻" },
  { title: "Marketing", icon: "📣" },
  { title: "Hospitality", icon: "🛎️" },
  { title: "Design", icon: "🎨" },
  { title: "Event Staff", icon: "🎫" },
  { title: "Logistics", icon: "📦" },
];

function HomePage() {
  const navigate = useNavigate();

  const [heroCat, setHeroCat] = useState("All categories");
  const [heroQuery, setHeroQuery] = useState("");

  const [gigs, setGigs] = useState([]);
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/tasks`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (active) setGigs(Array.isArray(d) ? d : []); })
      .catch(() => {});
    fetch(`${API_URL}/users/freelancers`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (active) setFreelancers(Array.isArray(d) ? d : []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useLayoutEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    els.forEach((el) => el.classList.add("reveal-init"));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("reveal-show"); obs.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });

  function findGigs() {
    const sp = new URLSearchParams();
    if (heroCat && heroCat !== "All categories") sp.set("category", heroCat);
    if (heroQuery.trim()) sp.set("search", heroQuery.trim());
    const qs = sp.toString();
    navigate(`/tasks${qs ? `?${qs}` : ""}`);
  }

  const featuredGig = gigs[0];
  const featuredFreelancers = freelancers.slice(0, 3);
  const avgRating = freelancers.length
    ? (freelancers.reduce((s, f) => s + (Number(f.rating) || 0), 0) / freelancers.length).toFixed(1)
    : "—";

  const countFor = (cat) => gigs.filter((g) => g.category === cat).length;
  const skillsOf = (csv) => String(csv || "").split(",").map((s) => s.trim()).filter(Boolean);

  const testimonials = [
      { text: "QuickHire helped me find flexible freelance work while studying. I can choose tasks that fit my schedule.", name: "Sara Ahmed", role: "Frontend Freelancer", rating: 5 },
      { text: "The matching system makes it easier to find suitable workers quickly instead of searching manually.", name: "Daniel Kovacs", role: "Client Manager", rating: 5 },
      { text: "I like seeing match scores, skills, and availability before applying. It makes the process much faster.", name: "Mira Hassan", role: "Support Specialist", rating: 4 },
    ];

  return (
    <>
      <Navbar />

      <section className="hungaryHero">
        <div className="heroLeft">
          <p className="label">On-demand freelance gig platform</p>
          <h1>Hire fast. Work smart. Grow together.</h1>
          <p>
            QuickHire connects businesses with available freelancers for short-term
            tasks using smart matching based on skills, availability, location,
            ratings, and performance.
          </p>

          <div className="heroButtons">
            <Link to="/register" className="mainBtn">Create Account</Link>
            <Link to="/tasks" className="outlineBtn">Browse Gigs</Link>
          </div>
        </div>

        <div className="heroRight">
          <span className="huStripe red"></span>
          <span className="huStripe white"></span>
          <span className="huStripe green"></span>

          <div className="dashboardPreview">
            <div className="previewTop">
              <span>Featured gig</span>
              <strong>{featuredGig ? featuredGig.category : "QuickHire"}</strong>
            </div>

            <h3>{featuredGig ? featuredGig.title : "Find your next gig"}</h3>
            <p>
              {featuredGig
                ? `${featuredGig.location} • €${featuredGig.hourlyRate}/hr`
                : "Browse real gigs from local businesses"}
            </p>

            <div className="miniStats">
              {(featuredGig ? skillsOf(featuredGig.requiredSkills).slice(0, 3) : ["React", "Design", "Support"]).map((s) => (
                <div key={s}><strong style={{ fontSize: 18 }}>{s}</strong><span>Skill</span></div>
              ))}
            </div>

            <Link to="/tasks" className="mainBtn" style={{ marginTop: 22 }}>View gigs</Link>
          </div>

          <div className="smallPreview">
            <strong>{gigs.length || "—"} gigs</strong>
            <span>available now</span>
          </div>
        </div>
      </section>

      <section className="searchPanel">
        <select value={heroCat} onChange={(e) => setHeroCat(e.target.value)}>
          <option>All categories</option>
          {CATEGORIES.map((c) => <option key={c.title}>{c.title}</option>)}
        </select>

        <input
          placeholder="Search by city or remote"
          value={heroQuery}
          onChange={(e) => setHeroQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") findGigs(); }}
        />
        <button className="searchBtn" onClick={findGigs}>Find Gigs</button>
      </section>

      <section className="statsBand reveal">
        <div className="statItem"><strong>{gigs.length || "—"}</strong><span>Open gigs</span></div>
        <div className="statItem"><strong>{freelancers.length || "—"}</strong><span>Freelancers</span></div>
        <div className="statItem"><strong>6</strong><span>Categories</span></div>
        <div className="statItem"><strong>{avgRating}★</strong><span>Avg rating</span></div>
      </section>

      <section className="howSection reveal" style={{ padding: "100px 7%", background: "white" }}>
              <p className="label redText">Why QuickHire &amp; how it works</p>
              <h2 style={{ fontSize: 56, margin: "12px 0 14px", maxWidth: 760 }}>
                A smarter way to manage short-term freelance work.
              </h2>
              <p style={{ fontSize: 20, color: "#596174", maxWidth: 760, lineHeight: 1.7 }}>
                Businesses post tasks in seconds; freelancers get matched to the right
                gigs by skills, location, and availability.
              </p>

              <div className="howSteps">
                <div className="howStep">
                  <div className="stepNum">1</div>
                  <h3>Post or browse</h3>
                  <p>Clients post a gig in seconds; freelancers browse the live marketplace.</p>
                </div>
                <div className="howStep">
                  <div className="stepNum">2</div>
                  <h3>Smart match</h3>
                  <p>Our engine scores every gig against a freelancer's skills and location.</p>
                </div>
                <div className="howStep">
                  <div className="stepNum">3</div>
                  <h3>Apply &amp; track</h3>
                  <p>Apply in one click, then track applications and AI recommendations on your dashboard.</p>
                </div>
              </div>
            </section>

      <section className="categorySection reveal">
        <p className="label">Job categories</p>
        <h2>What is your next gig?</h2>

        <div className="categoryGrid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {CATEGORIES.map((cat) => (
            <Link
              to={`/tasks?category=${encodeURIComponent(cat.title)}`}
              className="categoryCard"
              key={cat.title}
              style={{ display: "block" }}
            >
              <div className="categoryIcon">{cat.icon}</div>
              <h3>{cat.title}</h3>
              <p style={{ color: "#00843d", fontWeight: 800 }}>{countFor(cat.title)} open gigs</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="featuredSection reveal" style={{ padding: "90px 7%", background: "#f4f6fb" }}>
        <div className="testimonialTop">
          <div>
            <p className="label">Talent pool</p>
            <h2 style={{ fontSize: 56, margin: "12px 0 0" }}>Meet our freelancers</h2>
          </div>
          <Link to="/freelancers" className="mainBtn">View all</Link>
        </div>

        <div className="freelancerGrid" style={{ marginTop: 35 }}>
          {featuredFreelancers.length === 0 ? (
            <p style={{ color: "#667085" }}>Loading freelancers…</p>
          ) : (
            featuredFreelancers.map((f) => (
              <div className="freelancerCard" key={f.id}>
                <div className="freelancerAvatar">{(f.name || "U").charAt(0)}</div>
                <h2>{f.name}</h2>
                <p className="roleText">{f.role}</p>
                <p>{f.bio}</p>
                <div className="freelancerMeta">
                  <span>📍 {f.location || "—"}</span>
                  <span>⭐ {f.rating != null ? f.rating : "—"}</span>
                </div>
                <div className="skillRow">
                  {skillsOf(f.skills).slice(0, 4).map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="testimonialSection reveal">
        <div className="testimonialTop">
          <h2>See what users say</h2>
          <Link to="/register" className="mainBtn">Join QuickHire</Link>
        </div>

        <div className="testimonialGrid">
                  {testimonials.map((item) => (
                    <div className="testimonialCard" key={item.name}>
                      <div className="stars" aria-label={`${item.rating} out of 5`}>
                        <span className="starsFull">{"★".repeat(item.rating)}</span>
                        <span className="starsEmpty">{"★".repeat(5 - item.rating)}</span>
                      </div>

                      <p>“{item.text}”</p>

                      <div className="testimonialAuthor">
                        <div className="avatarBlank">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                          </svg>
                        </div>
                        <div><strong>{item.name}</strong><span>{item.role}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
      </section>

      <footer className="footer">
        <div>
          <h3>For workers</h3>
          <Link to="/tasks"><p>Find gigs</p></Link>
          <Link to="/register"><p>Create account</p></Link>
          <Link to="/profile"><p>Your profile</p></Link>
        </div>

        <div>
          <h3>For companies</h3>
          <Link to="/post-gig"><p>Post a task</p></Link>
          <Link to="/dashboard"><p>Hiring dashboard</p></Link>
          <Link to="/freelancers"><p>Browse talent</p></Link>
        </div>

        <div>
          <h3>QuickHire</h3>
          <Link to="/"><p>Home</p></Link>
          <Link to="/tasks"><p>Marketplace</p></Link>
          <Link to="/dashboard"><p>Dashboard</p></Link>
        </div>

        <div>
          <h3>Categories</h3>
          {CATEGORIES.slice(0, 4).map((c) => (
            <Link key={c.title} to={`/tasks?category=${encodeURIComponent(c.title)}`}><p>{c.title}</p></Link>
          ))}
        </div>
      </footer>
    </>
  );
}

function Protected({ children }) {
  return localStorage.getItem("user") ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post-gig" element={<Protected><><Navbar /><PostGig /></></Protected>} />
      <Route path="/login" element={<><Navbar /><Login /></>} />
      <Route path="/register" element={<><Navbar /><Register /></>} />

      <Route path="/tasks" element={<><Navbar /><Tasks /></>} />
      <Route path="/gigs" element={<Navigate to="/tasks" />} />

      <Route path="/dashboard" element={<Protected><><Navbar /><Dashboard /></></Protected>} />
      <Route path="/freelancers" element={<Protected><><Navbar /><Freelancers /></></Protected>} />
      <Route path="/freelancers/:id" element={<Protected><><Navbar /><FreelancerProfile /></></Protected>} />
      <Route path="/applications" element={<Protected><><Navbar /><Applications /></></Protected>} />
      <Route path="/profile" element={<Protected><><Navbar /><Profile /></></Protected>} />
    </Routes>
  );
}