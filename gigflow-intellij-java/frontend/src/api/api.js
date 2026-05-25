const API_URL = "http://localhost:8080/api";

function authHeader() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

export async function applyToTask(taskId, message) {
  const res = await fetch(`${API_URL}/applications/${taskId}`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Application failed");
  return res.json();
}

export async function getApplications() {
  const res = await fetch(`${API_URL}/applications`, {
    headers: authHeader(),
  });

  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function updateApplicationStatus(id, status) {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update application");
  return res.json();
}