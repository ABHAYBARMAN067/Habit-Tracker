const habits = ["English", "Typing", "Coding", "Aptitude", "Reasoning"];
let currentDate = new Date();
const API_BASE = 'https://habit-tracker-btet.onrender.com/api/habits';
const USER = 'default';
const STORE_PREFIX = 'habit-tracker';

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
    const res = await fetch(`${API_BASE}/${USER}/${monthStr}`);
    if (res.ok) {
      const data = await res.json();
      data.forEach(h => {
        const key = `${h.habit}-${h.day}`;
        backendHabits[key] = h.status;
      });
    }
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
    const habitCell = document.createElement('td'); habitCell.className = 'habit-name'; habitCell.textContent = habit; tr.appendChild(habitCell);

    for (let d = 1; d <= daysInMonth; d++) {
      const td = document.createElement('td'); td.className = 'cell';
      td.dataset.habit = habit; td.dataset.year = year; td.dataset.month = month; td.dataset.day = d;

      const key = cellKey(habit, year, month, d);
      const backendKey = `${habit}-${d}`;
      const backendState = backendHabits[backendKey];
      const localState = localStorage.getItem(key);

      // Prioritize backend if available, else local
      const state = backendState || localState;

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

  if (state === 'done') { td.classList.add('done'); td.textContent = '✅'; localStorage.setItem(cellKey(habit, year, month, day), 'done'); }
  else if (state === 'missed') { td.classList.add('missed'); td.textContent = '❌'; localStorage.setItem(cellKey(habit, year, month, day), 'missed'); }
  else { td.classList.add('empty'); localStorage.removeItem(cellKey(habit, year, month, day)); }

  // Update backend
  try {
    await fetch(`${API_BASE}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: USER, month: monthStr, habit, day: parseInt(day), status: state })
    });
  } catch (err) {
    console.error('Failed to update backend:', err);
  }
}

function changeMonth(offset) { currentDate.setMonth(currentDate.getMonth() + offset); renderTable(); }
renderTable();