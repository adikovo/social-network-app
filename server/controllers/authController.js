const User = require("../models/User");

//authentication controller for login and register operations
const handleAuthCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        switch (command) {
            case 'login':
                //validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    return res.json({ message: 'invalid email format' })
                }

                //find user by email and check password
                const loginUser = await User.findOne({ email: data.email })
                if (!loginUser) {
                    return res.json({ message: 'user not found' })
                }
                if (loginUser.password !== data.password) {
                    return res.json({ message: 'invalid password' })
                }
                return res.json({
                    message: 'login successful',
                    user: {
                        id: loginUser._id,
                        name: loginUser.name,
                        email: loginUser.email,
                        role: loginUser.role
                    }
                })

            case 'register':
                //validate email format
                const registerEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!registerEmailRegex.test(data.email)) {
                    return res.json({ message: 'invalid email format' })
                }

                //validate required fields
                if (!data.name || !data.email || !data.password) {
                    return res.json({ message: 'all fields are required' })
                }

                //validate password length
                if (data.password.length < 6) {
                    return res.json({ message: 'password must be at least 6 characters' })
                }

                //check if email already in use
                const existingUser = await User.findOne({ email: data.email })
                if (existingUser) {
                    return res.json({ message: 'user already exists with this email' })
                }

                //create new user
                const newRegisterUser = new User({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: 'user',
                    friends: [],
                    groups: []
                })
                //save user to db as new document
                await newRegisterUser.save()
                return res.json({
                    message: 'user registered successfully',
                    user: {
                        id: newRegisterUser._id,
                        name: newRegisterUser.name,
                        email: newRegisterUser.email,
                        role: newRegisterUser.role
                    }
                })

            default:
                return res.json({ message: 'invalid command' })
        }
    }
    catch (error) {
        return res.json({ message: 'an error occurred', error: error.message })
    }
}

module.exports = { handleAuthCommand }
