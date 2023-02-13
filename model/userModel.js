const { Schema, model } = require('mongoose');

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Min length will be 6 ']
    },
    role: {
        type: Boolean
    }
});

const User = new model('User', userSchema);

module.exports = User;
