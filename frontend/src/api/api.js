const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

// Real login against the backend JWT system. Returns { token, user }.
export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: data.email, password: data.password }),
  });
  if (!res.ok) throw new Error("Invalid login details");
  return res.json();
}

// Real registration. Creates a user row in the database. Returns { token, user }.
export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "FREELANCER",
    }),
  });
  if (!res.ok) throw new Error("Registration failed (the email may already exist)");
  return res.json();
}

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}