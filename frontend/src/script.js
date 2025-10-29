import { getHabits, updateHabit, getCustomHabits, addCustomHabit, deleteCustomHabit } from './api.js';

// let habits = ["English", "Typing", "Coding", "Aptitude", "Reasoning", "Exercise", "Reading", "Meditation", "Journaling", "Learning"];
let habits = []
let currentDate = new Date();
let backendHabits = {};
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

// Hamburger menu toggle
function toggleMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const hamburger = document.getElementById('hamburger');
  navMenu.classList.toggle('show');
  hamburger.classList.toggle('active');
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
  backendHabits = {};
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
    const streak = calculateStreak(habit, backendHabits, currentDate);
    const tr = document.createElement('tr');
    const habitCell = document.createElement('td'); habitCell.className = 'habit-name';
    const habitText = document.createElement('span'); habitText.textContent = `${habit} (${streak})`; habitCell.appendChild(habitText);

    // Add remove button for all habits
    const removeBtn = document.createElement('button'); removeBtn.innerHTML = '&#128465;'; removeBtn.className = 'remove-btn';
    removeBtn.title = 'Remove habit';
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

  // Render charts after table
  const progressData = calculateProgressData(habits, backendHabits);
  renderCharts(progressData);

  // Render achievements
  const achievements = checkAchievements(habits, backendHabits);
  renderAchievements(achievements);
}

function cellKey(habit, year, month, day) {
  return `${STORE_PREFIX}::${habit.replace(/\s+/g, '_').toLowerCase()}::${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function calculateStreak(habit, backendHabits, currentDate) {
  let streak = 0;
  let checkDate = new Date(currentDate);
  checkDate.setHours(0, 0, 0, 0); // Normalize to start of day

  while (true) {
    const day = checkDate.getDate();
    const month = checkDate.getMonth();
    const year = checkDate.getFullYear();
    const key = `${habit}-${day}`;

    if (backendHabits[key] === 'done') {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateProgressData(habits, backendHabits) {
  const progressData = habits.map(habit => {
    let done = 0;
    let missed = 0;
    let empty = 0;

    for (let d = 1; d <= 31; d++) { // Assuming max 31 days
      const key = `${habit}-${d}`;
      const status = backendHabits[key];
      if (status === 'done') done++;
      else if (status === 'missed') missed++;
      else empty++;
    }

    return { habit, done, missed, empty };
  });

  return progressData;
}

function renderCharts(progressData) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  const labels = progressData.map(d => d.habit);
  const doneData = progressData.map(d => d.done);
  const missedData = progressData.map(d => d.missed);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Done',
          data: doneData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Missed',
          data: missedData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function checkAchievements(habits, backendHabits) {
  const achievements = [];
  habits.forEach(habit => {
    const streak = calculateStreak(habit, backendHabits, currentDate);
    if (streak >= 30) achievements.push(`🏆 30-Day Streak for ${habit}!`);
    else if (streak >= 7) achievements.push(`🔥 7-Day Streak for ${habit}!`);
    // Add more achievement logic as needed
  });
  return achievements;
}

function renderAchievements(achievements) {
  const achievementsDiv = document.getElementById('achievements');
  achievementsDiv.innerHTML = '';
  if (achievements.length === 0) {
    achievementsDiv.innerHTML = '<p>No achievements yet. Keep building streaks!</p>';
  } else {
    achievements.forEach(achievement => {
      const p = document.createElement('p');
      p.textContent = achievement;
      achievementsDiv.appendChild(p);
    });
  }
}

function toggleView() {
  const tableView = document.querySelector('.sheet');
  const calendarView = document.getElementById('calendarView');
  if (tableView.style.display === 'none') {
    tableView.style.display = 'block';
    calendarView.style.display = 'none';
  } else {
    tableView.style.display = 'none';
    calendarView.style.display = 'block';
    renderCalendar();
  }
}

function renderCalendar() {
  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = '';
  // Simple calendar implementation - can be enhanced with a library like FullCalendar
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Create calendar grid
  const calendar = document.createElement('div');
  calendar.className = 'calendar-grid';

  // Days of week header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });

  // Empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    calendar.appendChild(emptyCell);
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    dayCell.innerHTML = `<strong>${d}</strong>`;
    // Add habit status for each habit on this day in a grid format
    const habitGrid = document.createElement('div');
    habitGrid.className = 'habit-grid';
    habits.forEach(habit => {
      const status = backendHabits[`${habit}-${d}`];
      const habitIcon = document.createElement('span');
      habitIcon.className = 'habit-icon';
      if (status === 'done') habitIcon.textContent = '✅';
      else if (status === 'missed') habitIcon.textContent = '❌';
      else habitIcon.textContent = '○';
      habitGrid.appendChild(habitIcon);
    });
    dayCell.appendChild(habitGrid);
    calendar.appendChild(dayCell);
  }

  calendarDiv.appendChild(calendar);
}

function shareProgress() {
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => backendHabits[`${habit}-${currentDate.getDate()}`] === 'done').length;
  const shareText = `I've completed ${completedToday}/${totalHabits} habits today on Habit Tracker! Check it out: ${window.location.href}`;
  if (navigator.share) {
    navigator.share({
      title: 'My Habit Progress',
      text: shareText,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Progress link copied to clipboard!');
    });
  }
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
    // Re-render achievements after state change
    const achievements = checkAchievements(habits, backendHabits);
    renderAchievements(achievements);
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

  // Add hamburger menu event listener
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
}

// Expose functions to global scope for HTML onclick
window.changeMonth = changeMonth;
window.addHabit = addHabit;
window.logout = logout;
window.toggleView = toggleView;
window.shareProgress = shareProgress;

init();
