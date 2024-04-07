const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('signup', schema );

mongoose.connect('mongodb://127.0.0.1:27017').then(console.log("Database connected")).catch("database error");

module.exports = User;