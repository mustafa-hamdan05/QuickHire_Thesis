import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  const active = (path) => (location.pathname === path ? "activeLink" : "");

  return (
    <nav className="navbar">
      <Link to="/" className="quickhireTextLogo">
        QuickHire
      </Link>

      <div className="navLinks">
        <Link className={active("/")} to="/">Home</Link>

        {user && (
          <>
            <Link className={active("/dashboard")} to="/dashboard">Dashboard</Link>
            <Link className={active("/tasks")} to="/tasks">Gigs</Link>
            <Link className={active("/freelancers")} to="/freelancers">Freelancers</Link>
            <Link className={active("/applications")} to="/applications">Applications</Link>
            <Link className={active("/profile")} to="/profile">Profile</Link>
          </>
        )}

        {!user ? (
          <Link className="loginBtn" to="/login">Login</Link>
        ) : (
          <button className="logoutBtn" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}