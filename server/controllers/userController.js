
const User = require("../models/User");


//api endpoint to handle all CRUD operations
const handleUserCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'insert':
                //create new user document
                const newUser = new User({ 
                    name: data.name, 
                    email: data.email, 
                    password: String, 
                    role: String, 
                    friends: Array, 
                    groups: Array })

                //save user to db as new document
                await newUser.save()
                return res.json({ message: 'user inserted successfully', user: newUser })

            case 'select':
                //fetch all users from db
                const users = await User.find({})
                return res.json({ message: 'all users fetched successfully', users: users })

            case 'update':
                //find user by id and update their details
                const updateUser = await User.findByIdAndUpdate(
                    data.userId,
                    { email: data.newEmail },
                    { new: true }
                )
                if (!updateUser) {
                    return res.json({ message: 'user not found' })
                }
                else {
                    return res.json({ message: 'user found & updated successfully', user: updateUser })
                }

            case 'delete':
                //find user by id and delete them
                const deleteUser = await (User.findByIdAndDelete(data.userId))
                if (!deleteUser) {
                    return res.json({ message: 'user not found' })
                }
                else {
                    return res.json({ message: 'user deleted successfully', user: deleteUser })
                }

            //if command is not recognized
            default:
                return res.json({ message: 'invalid command' })
        }
    }
    catch (error) {
        return res.json({ message: 'an error occurred', error: error.message })
    }
}

module.exports = { handleUserCommand }