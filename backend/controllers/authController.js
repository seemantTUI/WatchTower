const User = require('../models/userModel');
const mongoose = require('mongoose');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    const { name, email, password, notificationChannel, telephone, webhookUrl } = req.body;
    try {
        if (!name) return res.status(400).json({ msg: "Please enter a name" });
        if (!email) return res.status(400).json({ msg: "Please enter an email" });
        if (!password) return res.status(400).json({ msg: "Please enter a password" });

        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (user) return res.status(400).json({ msg: "A user with this email already exists" });

        user = new User({
            name,
            email: normalizedEmail,
            password,
            ...(notificationChannel && { notificationChannel }),
            ...(telephone && { telephone }),
            ...(webhookUrl && { webhookUrl })
        });

        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name,
                email: normalizedEmail,
                notificationChannel: user.notificationChannel
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email) return res.status(400).json({ msg: "Please enter an email" });
        if (!password) return res.status(400).json({ msg: "Please enter a password" });

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(400).json({ msg: "Invalid Email" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

        const token = generateToken(user);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: normalizedEmail
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to load user' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, email, notificationChannel, telephone, webhookUrl } = req.body;

    try {
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email,
                notificationChannel,
                telephone,
                webhookUrl,
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ msg: 'Update failed', error: err.message });
    }
};
