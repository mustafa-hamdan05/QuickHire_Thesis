import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "FREELANCER",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await registerUser(form);

      // NEW: remember this account so the user can log in again later
      const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
      const email = form.email.trim().toLowerCase();
      const exists = accounts.some((a) => a.email.toLowerCase() === email);

      if (!exists) {
        accounts.push({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });
        localStorage.setItem("accounts", JSON.stringify(accounts));
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/tasks");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <span className="label">JOIN QUICKHIRE</span>

        <h1>Create Account</h1>

        <p>
          Join QuickHire, a freelance platform built for fast hiring,
          flexible work, and smart matching.
        </p>

        <form className="authForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="FREELANCER">Freelancer</option>
            <option value="CLIENT">Client</option>
          </select>

          <button className="authBtn" type="submit">
            Create Account
          </button>
        </form>

        <div className="authBottom">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
