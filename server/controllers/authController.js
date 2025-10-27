const User = require("../models/User");

// Login user
const loginUser = async (data) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('invalid email format');
    }

    // Find user by email and check password
    const loginUser = await User.findOne({ email: data.email });
    if (!loginUser) {
        throw new Error('user not found');
    }
    if (loginUser.password !== data.password) {
        throw new Error('invalid password');
    }

    return {
        message: 'login successful',
        user: {
            id: loginUser._id,
            name: loginUser.name,
            email: loginUser.email,
            role: loginUser.role
        }
    };
};

// Register new user
const registerUser = async (data) => {
    // Validate email format
    const registerEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerEmailRegex.test(data.email)) {
        throw new Error('invalid email format');
    }

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
        throw new Error('all fields are required');
    }

    // Validate password length
    if (data.password.length < 6) {
        throw new Error('password must be at least 6 characters');
    }

    // Check if email already in use
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new Error('user already exists with this email');
    }

    // Create new user
    const newRegisterUser = new User({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'user',
        friends: [],
        groups: []
    });

    // Save user to db as new document
    await newRegisterUser.save();

    return {
        message: 'user registered successfully',
        user: {
            id: newRegisterUser._id,
            name: newRegisterUser.name,
            email: newRegisterUser.email,
            role: newRegisterUser.role
        }
    };
};

module.exports = {
    loginUser,
    registerUser
};