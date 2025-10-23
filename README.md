# Habit Tracker

A simple web-based habit tracker application that allows users to track daily habits for a month. The app features a responsive design, local storage, and optional backend integration with MongoDB.

## Features

- Track multiple habits (e.g., English, Typing, Coding, Aptitude, Reasoning)
- Monthly view with clickable cells to mark habits as Done (✅), Missed (❌), or Not Marked
- Responsive design for mobile and desktop
- Local storage for offline use
- Backend support for data persistence using MongoDB
- Navigation between months

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Other:** CORS, dotenv

## Project Structure

```
habit-tracker/
├── README.md
├── backend/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── routes/
│       └── habits.js
└── frontend/
    ├── index.html
    ├── script.js
    └── style.css
```

- **backend/**: Contains the Node.js/Express server, MongoDB models, and API routes.
- **frontend/**: Contains the HTML, CSS, and JavaScript files for the client-side application.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `backend` directory with your MongoDB URI:
   ```
   MONGODB_URI=mongodb://localhost:27017/habit-tracker  # Replace with your MongoDB connection string

4. Start the backend server:
   ```
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### Frontend Setup

The frontend files are in the `frontend` directory. Open `frontend/index.html` in a web browser to run the app. For full functionality, ensure the backend is running.

## Usage

1. Open `frontend/index.html` in your browser.
2. The app displays a table with habits and days of the month.
3. Click on a cell to cycle through states: Not Marked → Done → Missed → Not Marked.
4. Use the Previous/Next buttons to navigate between months.
5. Data is saved locally and synced with the backend if available.

## API Endpoints

- `GET /api/habits/:user/:month` - Fetch habits for a user and month
- `POST /api/habits/update` - Update a habit status

## Contributing

Feel free to fork the repository and submit pull requests for improvements.

## Repository

Check out the project on GitHub: [https://github.com/ABHAYBARMAN067/Habit-Tracker](https://github.com/ABHAYBARMAN067/Habit-Tracker)

