
const User = require("../models/User");


//api endpoint to handle all CRUD operations
const handleUserCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'create':
                //create new user document
                const newUser = new User({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    friends: data.friends,
                    groups: data.groups
                })

                //save user to db as new document
                await newUser.save()
                return res.json({ message: 'user inserted successfully', user: newUser })

            case 'list':
                //fetch all users from db
                const users = await User.find({})
                return res.json({ message: 'all users fetched successfully', users: users })

            case 'search':
                //multi parameter search for users
                const { name, email, role } = data
                const searchQuery = {}

                //build search query based on provided parameters
                if (name) {
                    searchQuery.name = { $regex: name, $options: 'i' }
                }
                if (email) {
                    searchQuery.email = { $regex: email, $options: 'i' }
                }
                if (role) {
                    searchQuery.role = role
                }

                const searchResults = await User.find(searchQuery)
                return res.json({
                    message: 'user search completed successfully',
                    users: searchResults,
                    searchCriteria: searchQuery
                })

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
                    //remove deleted user from all the other user friends arrays
                    await User.updateMany(
                        { friends: data.userId },
                        { $pull: { friends: data.userId } }
                    )
                    return res.json({ message: 'user deleted successfully', user: deleteUser })
                }

            case 'addFriend':

                //add a friend to the user's friends list
                await User.findByIdAndUpdate(
                    data.userId,
                    { $addToSet: { friends: data.friendId } },
                    { new: true }
                )
                //add userID to the friend's friends array
                await User.findByIdAndUpdate(
                    data.friendId,
                    { $addToSet: { friends: data.userId } },
                    { new: true }
                )
                return res.json({ message: 'friend added successfully' })

            case 'removeFriend':
                //remove a friend from the user's friends list

                //remove friendID from the user's friends array
                await User.findByIdAndUpdate(
                    data.userId,
                    { $pull: { friends: data.friendId } },
                    { new: true }
                )
                //remove userID from friend's friends array
                await User.findByIdAndUpdate(
                    data.friendId,
                    { $pull: { friends: data.userId } },
                    { new: true }
                )
                return res.json({ message: 'friend removed successfully ' })

            case 'getFriends':
                //get all friends of a user with their details
                const user = await User.findById(data.userId)
                if (!user) {
                    return res.json({ message: 'user not found' })
                }
                //get friend details
                const friends = await User.find({ _id: { $in: user.friends } })
                return res.json({
                    message: 'friends retrieved successfully',
                    friends: friends
                })

            case 'getUser':
                const getUser = await User.findById(data.userId)
                if (!getUser) {
                    return res.json({ message: 'user not found' })
                }
                return res.json({
                    message: 'user fetched successfully',
                    user: {
                        id: getUser._id,
                        name: getUser.name,
                        email: getUser.email,
                        role: getUser.role,
                        friends: getUser.friends,
                        groups: getUser.groups,
                        bio: getUser.bio
                    }
                })

            case 'updateBio':
                //update user's bio information
                const updateBioUser = await User.findByIdAndUpdate(
                    data.userId,
                    { bio: data.bio },
                    { new: true }
                )
                if (!updateBioUser) {
                    return res.json({ message: 'user not found' })
                }
                return res.json({
                    message: 'bio updated successfully',
                    user: updateBioUser
                })

            case 'getBio':
                //get user's bio information
                const getBioUser = await User.findById(data.userId)
                if (!getBioUser) {
                    return res.json({ message: 'user not found' })
                }
                return res.json({
                    message: 'bio fetched successfully',
                    bio: getBioUser.bio
                })

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