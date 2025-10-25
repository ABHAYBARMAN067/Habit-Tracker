const BASE_URL = window.location.origin + "/api";

// ✅ Login API
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ✅ Signup API
export const signupUser = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
};

// Habits functions
async function getHabits(user, month) {
  const res = await fetch(`${BASE_URL}/habits/${user}/${month}`);
  return res.json();
}

async function updateHabit(user, month, habit, day, status) {
  const res = await fetch(`${BASE_URL}/habits/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, month, habit, day, status })
  });
  return res.json();
}

// Custom Habits functions
async function getCustomHabits(user) {
  const res = await fetch(`${BASE_URL}/custom-habits/${user}`);
  return res.json();
}

async function addCustomHabit(user, habit) {
  const res = await fetch(`${BASE_URL}/custom-habits/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, habit })
  });
  return res.json();
}

async function deleteCustomHabit(user, habit) {
  const res = await fetch(`${BASE_URL}/custom-habits/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, habit })
  });
  return res.json();
}
