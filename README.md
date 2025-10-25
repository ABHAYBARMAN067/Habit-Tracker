# Habit Tracker

A simple web-based habit tracker application that allows users to track daily habits for a month. The app features a responsive design, local storage, and optional backend integration with MongoDB.

## Features

- Track multiple habits (e.g., English, Typing, Coding, Aptitude, Reasoning, Exercise, Reading, Meditation, Journaling, Learning)
- Add custom habits dynamically and remove them as needed
- Monthly view with clickable cells to mark habits as Done (✅), Missed (❌), or Not Marked
- Responsive design for mobile and desktop
- Local storage for offline use
- Backend support for data persistence using MongoDB Atlas
- Navigation between months
- User authentication (login and signup)

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Other:** CORS, dotenv

## Project Structure and File Descriptions

```
habit-tracker/
├── README.md                          # This file: Project overview, setup instructions, and file descriptions
├── backend/                           # Backend directory containing server-side code
│   ├── .env                           # Environment variables file (e.g., MongoDB URI, JWT secret) - not committed to Git
│   ├── .gitignore                     # Specifies files/folders to ignore in Git (e.g., node_modules, .env)
│   ├── package.json                   # Node.js project configuration: dependencies, scripts, and metadata
│   ├── package-lock.json              # Lockfile ensuring exact dependency versions for consistent installs
│   ├── server.js                      # Main server file: sets up Express app, connects to MongoDB, defines middleware and routes
│   ├── models/                        # Directory for Mongoose database models
│   │   ├── User.js                    # Mongoose model for users: defines schema for username, email, and hashed password
│   │   ├── Habit.js                   # Mongoose model for habit entries: schema for user, month, habit name, day, and status
│   │   └── CustomHabit.js             # Mongoose model for custom habits: schema for user and custom habit name
│   └── routes/                        # Directory for API route handlers
│       ├── auth.js                    # Routes for user authentication: signup and login endpoints
│       ├── habits.js                  # Routes for habit management: fetch and update habit statuses
│       └── customHabits.js            # Routes for custom habits: add, fetch, and delete custom habits
├── frontend/                          # Frontend directory containing client-side code
│   ├── assets/                        # Static assets like stylesheets
│   │   └── style.css                  # CSS file for styling the app: responsive design, colors, layouts
│   ├── src/                           # JavaScript source files
│   │   ├── api.js                     # API utility functions: handles fetch requests to backend for auth, habits, and custom habits
│   │   ├── auth.js                    # Handles authentication UI: login and signup form submissions and API calls
│   │   └── script.js                  # Main script for habit tracker: renders habit table, handles user interactions, month navigation
│   ├── index.html                     # Main habit tracker page: HTML structure for the app interface
│   ├── login.html                     # Login page: form for user login
│   ├── signup.html                    # Signup page: form for user registration
│   └── about.html                     # About page: description of the app
└── .git/                              # Git repository metadata (hidden directory)
```

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

1. Open `frontend/login.html` in your browser to sign up or login.
2. After authentication, the app displays a table with habits and days of the month.
3. Click on a cell to cycle through states: Not Marked → Done → Missed → Not Marked.
4. Use the Previous/Next buttons to navigate between months.
5. Click the "+ Add Habit" button to add custom habits.
6. Click the ❌ button next to custom habits to remove them.
7. Data is saved locally and synced with the backend if available.

## API Endpoints

- `GET /api/habits/:user/:month` - Fetch habits for a user and month
- `POST /api/habits/update` - Update a habit status
- `GET /api/custom-habits/:user` - Fetch custom habits for a user
- `POST /api/custom-habits/add` - Add a custom habit for a user
- `DELETE /api/custom-habits/delete` - Delete a custom habit for a user
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

## Contributing

Feel free to fork the repository and submit pull requests for improvements.

## Repository

Check out the project on GitHub: [https://github.com/ABHAYBARMAN067/Habit-Tracker](https://github.com/ABHAYBARMAN067/Habit-Tracker)
