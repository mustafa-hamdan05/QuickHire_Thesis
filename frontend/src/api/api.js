const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

export async function loginUser(data) {
  return {
    token: "demo-token",
    user: {
      name: "Demo Client",
      email: data.email,
      role: "CLIENT",
    },
  };
}

export async function registerUser(data) {
  return {
    token: "demo-token",
    user: {
      name: data.name,
      email: data.email,
      role: data.role || "CLIENT",
    },
  };
}

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function applyToTask(taskId, message) {
  return {
    success: true,
    taskId,
    message,
  };
}

export async function getApplications() {
  return [];
}

export async function updateApplicationStatus(id, status) {
  return {
    id,
    status,
  };
}