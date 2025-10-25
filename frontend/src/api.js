const API_BASE = '';

// Auth functions
async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

async function signup(username, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    return res.json();
}

// Habits functions
async function getHabits(user, month) {
    const res = await fetch(`${API_BASE}/habits/${user}/${month}`);
    return res.json();
}

async function updateHabit(user, month, habit, day, status) {
    const res = await fetch(`${API_BASE}/habits/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, month, habit, day, status })
    });
    return res.json();
}

// Custom Habits functions
async function getCustomHabits(user) {
    const res = await fetch(`${API_BASE}/custom-habits/${user}`);
    return res.json();
}

async function addCustomHabit(user, habit) {
    const res = await fetch(`${API_BASE}/custom-habits/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, habit })
    });
    return res.json();
}

async function deleteCustomHabit(user, habit) {
    const res = await fetch(`${API_BASE}/custom-habits/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, habit })
    });
    return res.json();
}
