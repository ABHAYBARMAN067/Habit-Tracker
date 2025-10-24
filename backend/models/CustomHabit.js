const mongoose = require('mongoose');

const customHabitSchema = new mongoose.Schema({
    user: { type: String, required: true },
    habit: { type: String, required: true }
});

module.exports = mongoose.model('CustomHabit', customHabitSchema);
