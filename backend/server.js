// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routers
const habitsRouter = require('./routes/habits');
const authRouter = require('./routes/auth');
const customHabitsRouter = require('./routes/customHabits');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/habits', habitsRouter);
app.use('/api/auth', authRouter);
app.use('/api/custom-habits', customHabitsRouter);

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("Error: MONGODB_URI is not defined in environment variables!");
  process.exit(1); // Stop server if URI not found
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));



// Optional root route
app.get('/', (req, res) => {
  res.send('Habit Tracker Backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
