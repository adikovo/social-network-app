
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
                const { name, age, location, budget, pets, cleanliness, smoking } = data
                const searchQuery = {}

                //build search query based on provided parameters
                if (name) {
                    searchQuery.name = { $regex: name, $options: 'i' }
                }
                if (age) {
                    const ageNumber = parseInt(age);
                    if (!isNaN(ageNumber)) {
                        searchQuery['bio.age'] = ageNumber
                    }
                }
                if (location) {
                    searchQuery['bio.location'] = { $regex: location, $options: 'i' }
                }
                if (budget) {
                    searchQuery['bio.budget'] = { $regex: budget, $options: 'i' }
                }
                if (pets) {
                    searchQuery['bio.lifestyle.pets'] = pets
                }
                if (cleanliness) {
                    searchQuery['bio.lifestyle.cleanliness'] = cleanliness
                }
                if (smoking) {
                    searchQuery['bio.lifestyle.smoking'] = smoking
                }

                const searchResults = await User.find(searchQuery);
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
                console.log('Accepting friend request:', data);

                //remove from requests & add to friends array
                const acceptor = await User.findByIdAndUpdate(
                    //the user that accepted
                    data.userId,
                    {
                        $pull: { receivedRequests: data.friendId },
                        $addToSet: { friends: data.friendId }
                    },
                    { new: true }
                );
                console.log('Acceptor updated:', acceptor?.friends);

                //remove from sender's pending array & add to their friends list
                const sender = await User.findByIdAndUpdate(
                    data.friendId,
                    {
                        $pull: { pendingRequests: data.userId },
                        $addToSet: { friends: data.userId }
                    },
                    { new: true }
                );
                console.log('Sender updated:', sender?.friends);

                // Add notification to the user who sent the friend request
                console.log('Creating friend request acceptance notification for user:', data.friendId);
                console.log('Acceptor user:', acceptor?.name);

                await User.findByIdAndUpdate(
                    data.friendId,
                    {
                        $push: {
                            notifications: {
                                type: 'friendRequestAccepted',
                                fromUserId: data.userId,
                                fromUserName: acceptor.name,
                                fromUserProfilePicture: acceptor.profilePicture,
                                message: `${acceptor.name} accepted your friend request`
                            }
                        }
                    }
                );
                console.log('Friend request acceptance notification created successfully');

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
                console.log('Getting friends for user:', data.userId);
                const user = await User.findById(data.userId)
                if (!user) {
                    return res.json({ message: 'user not found' })
                }
                console.log('User found, friends array:', user.friends);
                //get friend details
                const friends = await User.find({ _id: { $in: user.friends } })
                console.log('Friends found:', friends.length, friends.map(f => f.name));
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
                        bio: getUser.bio,
                        profilePicture: getUser.profilePicture
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

            case 'uploadProfilePicture':
                const { userId, pictureUrl } = data;
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { profilePicture: pictureUrl },
                    { new: true });
                res.json({ success: true, user: updatedUser })

            case 'deleteProfilePicture':
                const deleteUserPicture = await User.findByIdAndUpdate(
                    data.userId,
                    { profilePicture: null },
                    { new: true }
                );
                if (!deleteUser) {
                    return res.json({ success: false, message: 'User not found' });
                }
                return res.json({
                    success: true,
                    message: 'Profile picture deleted successfully',
                    user: deleteUserPicture
                });

            case 'getNotifications':
                const userWithNotifications = await User.findById(data.userId);
                if (!userWithNotifications) {
                    return res.json({ message: 'user not found' });
                }

                console.log('Fetching notifications for user:', data.userId);
                console.log('Total notifications found:', userWithNotifications.notifications.length);

                // Sort notifications by creation date (newest first)
                const sortedNotifications = userWithNotifications.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                console.log('Sorted notifications:', sortedNotifications.map(n => ({ type: n.type, message: n.message })));

                return res.json({
                    message: 'notifications retrieved successfully',
                    notifications: sortedNotifications
                });

            case 'dismissNotification':
                await User.findByIdAndUpdate(
                    data.userId,
                    { $pull: { notifications: { _id: data.notificationId } } }
                );
                return res.json({ message: 'notification dismissed successfully' });

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