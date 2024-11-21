const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login Route
router.post('/Login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        console.log('User found:', user); // Log the found user

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        console.log('Password provided:', password);
        console.log('Stored password:', user.password);

        // Directly compare the password
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const { password: _, ...userData } = user._doc;
        res.json({ success: true, user: userData });

    } catch (error) {
        console.error('Login error:', error.message || error);
        res.status(500).json({ success: false, message: 'Server error during login. Please try again later.' });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        const newUser = new User({ username, password }); // Store password as plain text
        await newUser.save();

        res.status(201).json({ success: true, message: 'User created successfully. Please log in.' });
    } catch (error) {
        console.error('Registration error:', error.message || error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
