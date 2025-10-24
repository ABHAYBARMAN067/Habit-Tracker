const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user: String,
    month: String,
    habit: String,
    day: Number,
    status: String
});

module.exports = mongoose.model('Habit', habitSchema);
