import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Freelancers from "./pages/Freelancers.jsx";
import Applications from "./pages/Applications.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostGig from "./pages/PostGig.jsx";

function HomePage() {
  const categories = [
    { title: "Web Development", jobs: ["Frontend Developer", "Backend Assistant", "Website Fixer"] },
    { title: "Hospitality", jobs: ["Waiter", "Catering Assistant", "Hotel Support"] },
    { title: "Logistics", jobs: ["Warehouse Assistant", "Mover", "Delivery Helper"] },
    { title: "Marketing", jobs: ["Social Media Assistant", "Content Creator", "Brand Promoter"] },
    { title: "Design", jobs: ["Graphic Designer", "UI Assistant", "Poster Designer"] }
  ];

  const testimonials = [
    {
      text: "QuickHire helped me find flexible freelance work while studying. I can choose tasks that fit my schedule.",
      name: "Sara Ahmed",
      role: "Frontend Freelancer"
    },
    {
      text: "The matching system makes it easier to find suitable workers quickly instead of searching manually.",
      name: "Daniel Kovacs",
      role: "Client Manager"
    },
    {
      text: "I like seeing match scores, skills, and availability before applying. It makes the process much faster.",
      name: "Mira Hassan",
      role: "Support Specialist"
    }
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
          <div className="dashboardPreview">
            <div className="previewTop">
              <span>Recommended Gig</span>
              <strong>94% Match</strong>
            </div>

            <h3>Frontend Website Assistant</h3>
            <p>Budapest • Today • €22/hr</p>

            <div className="miniStats">
              <div><strong>React</strong><span>Skill</span></div>
              <div><strong>4.8★</strong><span>Rating</span></div>
              <div><strong>Now</strong><span>Available</span></div>
            </div>
          </div>

          <div className="smallPreview">
            <strong>24 new gigs</strong>
            <span>available this week</span>
          </div>
        </div>
      </section>

      <section className="searchPanel">
        <select>
          <option>All categories</option>
          <option>Web Development</option>
          <option>Hospitality</option>
          <option>Logistics</option>
          <option>Marketing</option>
          <option>Design</option>
        </select>

        <input placeholder="Search by city or remote" />
        <Link to="/tasks" className="searchBtn">Find Gigs</Link>
      </section>

      <section className="infoSection">
        <div className="infoText">
          <p className="label redText">Why QuickHire?</p>
          <h2>A smarter way to manage short-term freelance work.</h2>
          <p>
            Businesses can post tasks quickly, while freelancers receive suitable
            opportunities based on their profile, skills, and availability.
          </p>
        </div>

        <div className="featureCards">
          <div className="featureCard">
            <span>01</span>
            <h3>Smart Matching</h3>
            <p>Rank workers using skills, availability, ratings, and task requirements.</p>
          </div>

          <div className="featureCard">
            <span>02</span>
            <h3>Applications</h3>
            <p>Freelancers apply quickly and clients accept or reject applications.</p>
          </div>

          <div className="featureCard">
            <span>03</span>
            <h3>Dashboard</h3>
            <p>Track tasks, applications, performance, and recommendations.</p>
          </div>
        </div>
      </section>

      <section className="categorySection">
        <p className="label">Job categories</p>
        <h2>What is your next gig?</h2>

        <div className="categoryGrid">
          {categories.map((cat) => (
            <div className="categoryCard" key={cat.title}>
              <h3>{cat.title}</h3>
              {cat.jobs.map((job) => (
                <p key={job}>{job}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="upgradeSection">
        <div className="upgradeCard">
          <h2>Upgrade your profile and increase your chances.</h2>
          <p>
            Add skills, availability, completed work, and performance history to
            improve your match score and receive better gig recommendations.
          </p>

          <div className="upgradeStats">
            <span>✓ Build your profile</span>
            <span>✓ Gain more skills</span>
            <span>✓ Improve match score</span>
          </div>

          <Link to="/profile" className="mainBtn">Improve Profile</Link>
        </div>

        <div className="profilePreviewCard">
          <h3>Lara Uys</h3>
          <p>4.9★ rating • 98% on time • Verified profile</p>
          <div className="skillRow">
            <span>Web Design</span>
            <span>Support</span>
            <span>Delivery</span>
          </div>
        </div>
      </section>

      <section className="earningsSection">
        <div>
          <h2>Maximise earnings, minimise uncertainty.</h2>
          <p>
            Freelancers can discover suitable work, negotiate rates, track
            applications, and work with trusted clients through one platform.
          </p>

          <Link to="/register" className="mainBtn">Sign up now</Link>
        </div>

        <div className="earningsBox">
          <h3>Example Shift</h3>
          <div className="earningLine">
            <span>Frontend Assistant</span>
            <strong>€23/hr</strong>
          </div>
          <div className="earningLine">
            <span>Event Support</span>
            <strong>€18/hr</strong>
          </div>
          <div className="earningLine highlight">
            <span>Best Match</span>
            <strong>96%</strong>
          </div>
        </div>
      </section>

      <section className="testimonialSection">
        <div className="testimonialTop">
          <h2>See what users say</h2>
          <Link to="/register" className="mainBtn">Join QuickHire</Link>
        </div>

        <div className="testimonialGrid">
          {testimonials.map((item) => (
            <div className="testimonialCard" key={item.name}>
              <p>“{item.text}”</p>
              <div>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <h3>For workers</h3>
          <p>How it works</p>
          <p>Find gigs</p>
          <p>Profile tips</p>
          <p>FAQ</p>
        </div>

        <div>
          <h3>For companies</h3>
          <p>Post a task</p>
          <p>Pricing</p>
          <p>Hiring dashboard</p>
          <p>Business support</p>
        </div>

        <div>
          <h3>QuickHire</h3>
          <p>About</p>
          <p>Careers</p>
          <p>Contact</p>
          <p>Privacy Policy</p>
        </div>

        <div>
          <h3>Resources</h3>
          <p>API Documentation</p>
          <p>Recommendation System</p>
          <p>Security</p>
          <p>Terms of Use</p>
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

      <Route path="/login" element={<><Navbar /><Login /></>} />
      <Route path="/register" element={<><Navbar /><Register /></>} />

      <Route path="/tasks" element={<><Navbar /><Tasks /></>} />
      <Route path="/gigs" element={<Navigate to="/tasks" />} />

      <Route path="/dashboard" element={<Protected><><Navbar /><Dashboard /></></Protected>} />
      <Route path="/freelancers" element={<Protected><><Navbar /><Freelancers /></></Protected>} />
      <Route path="/applications" element={<Protected><><Navbar /><Applications /></></Protected>} />
      <Route path="/profile" element={<Protected><><Navbar /><Profile /></></Protected>} />
    </Routes>
  );
}