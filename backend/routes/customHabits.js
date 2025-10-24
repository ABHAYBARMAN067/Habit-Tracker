const express = require('express');
const CustomHabit = require('../models/CustomHabit');
const router = express.Router();

// Get custom habits for a user
router.get('/:user', async (req, res) => {
    const { user } = req.params;
    try {
        const habits = await CustomHabit.find({ user });
        res.json(habits.map(h => h.habit));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a custom habit
router.post('/add', async (req, res) => {
    const { user, habit } = req.body;
    try {
        const existing = await CustomHabit.findOne({ user, habit });
        if (existing) {
            return res.status(400).json({ message: 'Habit already exists' });
        }
        const newHabit = new CustomHabit({ user, habit });
        await newHabit.save();
        res.status(201).json({ message: 'Habit added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a custom habit
router.delete('/delete', async (req, res) => {
    const { user, habit } = req.body;
    try {
        await CustomHabit.deleteOne({ user, habit });
        res.json({ message: 'Habit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
