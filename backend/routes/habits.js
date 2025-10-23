const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const habitSchema = new mongoose.Schema({
  user: String,
  month: String,
  habit: String,
  day: Number,
  status: String
});
const Habit = mongoose.model('Habit', habitSchema);

router.get('/:user/:month', async (req, res) => {
  const { user, month } = req.params;
  try {
    const habits = await Habit.find({ user, month });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update', async (req, res) => {
  const { user, month, habit, day, status } = req.body;
  try {
    await Habit.findOneAndUpdate(
      { user, month, habit, day },
      { status },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
