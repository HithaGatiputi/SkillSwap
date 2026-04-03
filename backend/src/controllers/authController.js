const User = require('../models/User');
const jwt = require('jsonwebtoken');
const globalState = require('../services/GlobalState');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey_change_this', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { username, email, password, skillsOffered, skillsWanted } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            username,
            email,
            password,
            skillsOffered: skillsOffered || [],
            skillsWanted: skillsWanted || []
        });

        if (user) {
            // Update Global State
            globalState.getGraph().addUser(user._id);

            if (user.skillsOffered) {
                user.skillsOffered.forEach(skill => globalState.getTrie().insert(skill));
            }

            globalState.getQueue().insert({
                userId: user._id,
                karma: user.karmaPoints,
                skills: user.skillsOffered
            });

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
