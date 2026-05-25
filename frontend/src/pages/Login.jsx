import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "client@gigflow.com",
    password: "123456",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await loginUser(form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid login details");
      console.error(err);
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <span className="label">WELCOME BACK</span>

        <h1>Login</h1>

        <p>
          Access your QuickHire dashboard, manage applications, browse gigs,
          and track smart recommendations.
        </p>

        <form className="authForm" onSubmit={handleSubmit}>
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

          <button className="authBtn" type="submit">
            Login
          </button>
        </form>

        <div className="authBottom">
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}