const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const habitsRouter = require('./routes/habits');
const authRouter = require('./routes/auth');
const customHabitsRouter = require('./routes/customHabits');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connect using .env
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// API routes
app.use('/api/habits', habitsRouter);
app.use('/api/auth', authRouter);
app.use('/api/custom-habits', customHabitsRouter);

// Optional root route
app.get('/', (req, res) => {
  res.send('Habit Tracker Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
