let habits = ["English", "Typing", "Coding", "Aptitude", "Reasoning", "Exercise", "Reading", "Meditation", "Journaling", "Learning"];
let currentDate = new Date();
const token = localStorage.getItem('token');
const USER = localStorage.getItem('user');
if (!token || !USER) {
  window.location.href = 'login.html';
}
const STORE_PREFIX = 'habit-tracker';

// Check login status and update navbar
function updateNavbar() {
  const navButtons = document.getElementById('nav-buttons');
  const token = localStorage.getItem('token');
  if (token) {
    // User is logged in, show Logout
    navButtons.innerHTML = '<button onclick="logout()">Logout</button>';
  } else {
    // User not logged in, show Login and Signup
    navButtons.innerHTML = '<button onclick="window.location.href=\'login.html\'">Login</button><button onclick="window.location.href=\'signup.html\'">Signup</button>';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNavbar();
  // Optionally redirect to login or refresh page
  window.location.reload();
}

// Load custom habits from backend
async function loadCustomHabits() {
  try {
    const customHabits = await getCustomHabits(USER);
    habits = [...habits, ...customHabits];
  } catch (err) {
    console.error('Failed to load custom habits:', err);
  }
}

async function renderTable() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  document.getElementById('monthHeader').textContent = `${monthName} ${year}`;
  const table = document.getElementById('habitTable');
  table.innerHTML = '';

  // Fetch habits from backend
  let backendHabits = {};
  try {
    const data = await getHabits(USER, monthStr);
    data.forEach(h => {
      const key = `${h.habit}-${h.day}`;
      backendHabits[key] = h.status;
    });
  } catch (err) {
    console.error('Failed to fetch habits:', err);
  }

  // Header
  const headerRow = document.createElement('tr');
  const firstTh = document.createElement('th'); firstTh.textContent = 'Habit / Date'; headerRow.appendChild(firstTh);

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    const dayShort = dt.toLocaleString('default', { weekday: 'short' });
    const th = document.createElement('th');
    const dateSpan = document.createElement('span'); dateSpan.className = 'date'; dateSpan.textContent = d;
    const daySpan = document.createElement('span'); daySpan.className = 'day'; daySpan.textContent = dayShort;
    th.appendChild(dateSpan); th.appendChild(daySpan);
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Rows
  habits.forEach(habit => {
    const tr = document.createElement('tr');
    const habitCell = document.createElement('td'); habitCell.className = 'habit-name';
    const habitText = document.createElement('span'); habitText.textContent = habit; habitCell.appendChild(habitText);

    // Add remove button for all habits
    const removeBtn = document.createElement('button'); removeBtn.textContent = 'Remove'; removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => removeHabit(habit);
    habitCell.appendChild(removeBtn);

    tr.appendChild(habitCell);

    for (let d = 1; d <= daysInMonth; d++) {
      const td = document.createElement('td'); td.className = 'cell';
      td.dataset.habit = habit; td.dataset.year = year; td.dataset.month = month; td.dataset.day = d;

      const backendKey = `${habit}-${d}`;
      const state = backendHabits[backendKey];

      if (state === 'done') { td.classList.add('done'); td.textContent = '✅'; }
      else if (state === 'missed') { td.classList.add('missed'); td.textContent = '❌'; }
      else { td.classList.add('empty'); td.textContent = ''; }

      td.title = `${habit} • ${d} ${monthName} ${year} — ${state ? state.toUpperCase() : 'Not marked'}`;

      td.addEventListener('click', () => cycleCell(td));
      tr.appendChild(td);
    }

    table.appendChild(tr);
  });
}

function cellKey(habit, year, month, day) {
  return `${STORE_PREFIX}::${habit.replace(/\s+/g, '_').toLowerCase()}::${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function cycleCell(td) {
  if (td.classList.contains('empty')) setState(td, 'done');
  else if (td.classList.contains('done')) setState(td, 'missed');
  else setState(td, 'empty');
}

async function setState(td, state) {
  td.classList.remove('empty', 'done', 'missed'); td.textContent = '';

  const habit = td.dataset.habit;
  const year = td.dataset.year;
  const month = td.dataset.month;
  const day = td.dataset.day;
  const monthStr = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}`;

  if (state === 'done') { td.classList.add('done'); td.textContent = '✅'; }
  else if (state === 'missed') { td.classList.add('missed'); td.textContent = '❌'; }
  else { td.classList.add('empty'); td.textContent = ''; }

  // Update backend
  try {
    await updateHabit(USER, monthStr, habit, parseInt(day), state);
  } catch (err) {
    console.error('Failed to update backend:', err);
  }
}

function changeMonth(offset) { currentDate.setMonth(currentDate.getMonth() + offset); renderTable(); }

async function addHabit() {
  const habitName = prompt('Enter new habit name:');
  if (habitName && habitName.trim()) {
    const trimmedName = habitName.trim();
    if (!habits.includes(trimmedName)) {
      try {
        const data = await addCustomHabit(USER, trimmedName);
        if (data.message === 'Habit added successfully') {
          habits.push(trimmedName);
          renderTable();
        } else {
          alert(data.message || 'Failed to add habit');
        }
      } catch (err) {
        console.error('Failed to add habit:', err);
        alert('Failed to add habit');
      }
    } else {
      alert('Habit already exists!');
    }
  }
}

async function removeHabit(habit) {
  if (confirm(`Are you sure you want to remove "${habit}"?`)) {
    try {
      const data = await deleteCustomHabit(USER, habit);
      if (data.message === 'Habit deleted successfully') {
        habits = habits.filter(h => h !== habit);
        renderTable();
      } else {
        alert('Failed to remove habit');
      }
    } catch (err) {
      console.error('Failed to remove habit:', err);
      alert('Failed to remove habit');
    }
  }
}

async function init() {
  updateNavbar();
  await loadCustomHabits();
  renderTable();
}

init();
