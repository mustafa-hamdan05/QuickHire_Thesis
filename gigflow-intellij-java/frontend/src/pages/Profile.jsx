import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
      <div className="profilePage">
        <div className="profileHero">
          <div className="profileAvatar">{(user.name || "H").charAt(0)}</div>
          <div>
            <p className="label">My profile</p>
            <h1>{user.name || "Hamdan Mustafa"}</h1>
            <p>Freelancer • Web Development • Budapest</p>
          </div>
        </div>

        <div className="profileGrid">
          <div className="profileCard">
            <h2>About</h2>
            <p>
              Motivated freelancer with experience in web development, task
              management, and smart digital platforms. Interested in flexible
              short-term gigs and modern technology projects.
            </p>
          </div>

          <div className="profileCard">
            <h2>Profile Strength</h2>
            <div className="profileScore">86%</div>
            <p>Your profile is strong. Add portfolio projects to improve your ranking.</p>
          </div>

          <div className="profileCard">
            <h2>Skills</h2>
            <div className="skillRow">
              <span>React</span>
              <span>JavaScript</span>
              <span>CSS</span>
              <span>Communication</span>
              <span>Problem Solving</span>
            </div>
          </div>

          <div className="profileCard">
            <h2>Performance</h2>
            <div className="profileStats">
              <div><strong>4.8★</strong><span>Rating</span></div>
              <div><strong>12</strong><span>Completed Gigs</span></div>
              <div><strong>94%</strong><span>Reliability</span></div>
            </div>
          </div>
        </div>
      </div>
  );
}