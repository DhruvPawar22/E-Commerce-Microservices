const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
// Register a new user
router.post('/register', async (req,res) => {
    try {
        const {username, password , email, firstname,lastname} = req.body;
        const existingUser = await User.findOne({ username, email });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const inputsalt=10;
        const hashedPassword = await bcrypt.hash(password, inputsalt);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            firstName: firstname,
            lastName: lastname
        });
        await newUser.save();
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(201).json({ 
            message: 'User registered successfully', 
            token });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
//login route

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const match_passwords = await bcrypt.compare(password, user.password);
        if (!match_passwords) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get user profile 
router.get('/profile', authenticateToken ,async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });

        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message:'Cant Find User'});
    }
});
// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const {username, email, firstName, lastName} = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, {
            username,
            email,
            firstName,
            lastName
        }, { new: true }).select('-password');
        return res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        
    }
})
module.exports = router;