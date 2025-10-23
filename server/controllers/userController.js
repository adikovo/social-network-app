
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

            case 'sendFriendRequest':
                //add friendId to the sender's pendingRequests array
                await User.findByIdAndUpdate(
                    //sender
                    data.userId,
                    { $addToSet: { pendingRequests: data.friendId } }
                )
                //add userID to the friend's friends array
                await User.findByIdAndUpdate(
                    //receiver
                    data.friendId,
                    { $addToSet: { receivedRequests: data.userId } }
                )
                return res.json({ message: 'friend added successfully' })

            case 'acceptFriendRequest':
                //remove from requests & add to friends array
                await User.findByIdAndUpdate(
                    //the user that accepted
                    data.userId,
                    {
                        $pull: { receivedRequests: data.friendId },
                        $addToSet: { friends: data.friendId }
                    }
                );
                //remove from sender's pending array & add to their friends list
                await User.findByIdAndUpdate(
                    data.friendId,
                    {
                        $pull: { pendingRequests: data.userId },
                        $addToSet: { friends: data.userId }
                    }
                );
                return res.json({ message: 'friend request accepted successfully' })

            case 'declineFriendRequest':
                //remove from requests array
                await User.findByIdAndUpdate(
                    //user that rejected
                    data.userId,
                    { $pull: { receivedRequests: data.friendId } }
                );
                await User.findByIdAndUpdate(
                    //user that hot rejected
                    data.friendId,
                    { $pull: { pendingRequests: data.userId } }
                );
                return res.json({ message: 'friend request declined successfully' })

            case 'cancelFriendRequest':
                //remove from sender's pending requests array
                await User.findByIdAndUpdate(
                    data.userId,
                    { $pull: { pendingRequests: data.friendId } }
                );
                //remove from receiver's received requests array
                await User.findByIdAndUpdate(
                    data.friendId,
                    { $pull: { receivedRequests: data.userId } }
                );
                return res.json({ message: 'friend request cancelled successfully' })

            case 'getFriendRequests':
                //get all friend requests for a user
                const req = await User.findById(data.userId).populate('receivedRequests');
                if (!req) {
                    return res.json({ message: 'user not found' })
                }
                return res.json({
                    message: 'friend requests retrieved successfully',
                    friendRequests: req.receivedRequests
                })

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

            case 'checkPendingRequest':
                //check if user has a pending request to another user
                const checkUser = await User.findById(data.userId)
                if (!checkUser) {
                    return res.json({ message: 'user not found' })
                }
                const hasPendingRequest = checkUser.pendingRequests.includes(data.friendId)
                return res.json({
                    message: 'pending request check completed',
                    hasPendingRequest: hasPendingRequest
                })

            case 'checkReceivedRequest':
                //check if user has received a request from another user
                const checkReceivedUser = await User.findById(data.userId)
                if (!checkReceivedUser) {
                    return res.json({ message: 'user not found' })
                }
                const hasReceivedRequest = checkReceivedUser.receivedRequests.includes(data.friendId)
                return res.json({
                    message: 'received request check completed',
                    hasReceivedRequest: hasReceivedRequest
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