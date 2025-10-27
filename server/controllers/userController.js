
const User = require("../models/User");
const { emitNotification } = require("../socket");

// Create a new user
const createUser = async (data) => {
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
    return { message: 'user inserted successfully', user: newUser }
}

// List all users
const listUsers = async (data) => {
    //fetch all users from db
    const users = await User.find({})
    return { message: 'all users fetched successfully', users: users }
}

// Search users with multiple parameters
const searchUsers = async (data) => {
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
    return {
        message: 'user search completed successfully',
        users: searchResults,
        searchCriteria: searchQuery
    }
}

// Update user details
const updateUser = async (data) => {
    //find user by id and update their details
    const updateUser = await User.findByIdAndUpdate(
        data.userId,
        { email: data.newEmail },
        { new: true }
    )
    if (!updateUser) {
        return { message: 'user not found' }
    }
    else {
        return { message: 'user found & updated successfully', user: updateUser }
    }
}

// Delete a user
const deleteUser = async (data) => {
    //find user by id and delete them
    const deleteUser = await (User.findByIdAndDelete(data.userId))
    if (!deleteUser) {
        return { message: 'user not found' }
    }
    else {
        //remove deleted user from all the other user friends arrays
        await User.updateMany(
            { friends: data.userId },
            { $pull: { friends: data.userId } }
        )
        return { message: 'user deleted successfully', user: deleteUser }
    }
}

// Send friend request
const sendFriendRequest = async (data) => {
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
    return { message: 'friend added successfully' }
}

// Accept friend request
const acceptFriendRequest = async (data) => {
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

    const notification = {
        type: 'friendRequestAccepted',
        fromUserId: data.userId,
        fromUserName: acceptor.name,
        fromUserProfilePicture: acceptor.profilePicture,
        message: `${acceptor.name} accepted your friend request`
    };

    await User.findByIdAndUpdate(
        data.friendId,
        {
            $push: {
                notifications: notification
            }
        }
    );
    console.log('Friend request acceptance notification created successfully');

    // Emit real-time notification to the user
    emitNotification(data.friendId, notification);

    return { message: 'friend request accepted successfully' }
}

// Decline friend request
const declineFriendRequest = async (data) => {
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
    return { message: 'friend request declined successfully' }
}

// Cancel friend request
const cancelFriendRequest = async (data) => {
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
    return { message: 'friend request cancelled successfully' }
}

// Get friend requests
const getFriendRequests = async (data) => {
    //get all friend requests for a user
    const req = await User.findById(data.userId).populate('receivedRequests');
    if (!req) {
        return { message: 'user not found' }
    }
    return {
        message: 'friend requests retrieved successfully',
        friendRequests: req.receivedRequests
    }
}

// Remove friend
const removeFriend = async (data) => {
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
    return { message: 'friend removed successfully ' }
}

// Get friends
const getFriends = async (data) => {
    //get all friends of a user with their details
    console.log('Getting friends for user:', data.userId);
    const user = await User.findById(data.userId)
    if (!user) {
        return { message: 'user not found' }
    }
    console.log('User found, friends array:', user.friends);
    //get friend details
    const friends = await User.find({ _id: { $in: user.friends } })
    console.log('Friends found:', friends.length, friends.map(f => f.name));
    return {
        message: 'friends retrieved successfully',
        friends: friends
    }
}

// Get user by ID
const getUser = async (data) => {
    const getUser = await User.findById(data.userId)
    if (!getUser) {
        return { message: 'user not found' }
    }
    return {
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
    }
}

// Update user bio
const updateBio = async (data) => {
    //update user's bio information
    const updateBioUser = await User.findByIdAndUpdate(
        data.userId,
        { bio: data.bio },
        { new: true }
    )
    if (!updateBioUser) {
        return { message: 'user not found' }
    }
    return {
        message: 'bio updated successfully',
        user: updateBioUser
    }
}

// Get user bio
const getBio = async (data) => {
    //get user's bio information
    const getBioUser = await User.findById(data.userId)
    if (!getBioUser) {
        return { message: 'user not found' }
    }
    return {
        message: 'bio fetched successfully',
        bio: getBioUser.bio
    }
}

// Check pending request
const checkPendingRequest = async (data) => {
    //check if user has a pending request to another user
    const checkUser = await User.findById(data.userId)
    if (!checkUser) {
        return { message: 'user not found' }
    }
    const hasPendingRequest = checkUser.pendingRequests.includes(data.friendId)
    return {
        message: 'pending request check completed',
        hasPendingRequest: hasPendingRequest
    }
}

// Check received request
const checkReceivedRequest = async (data) => {
    //check if user has received a request from another user
    const checkReceivedUser = await User.findById(data.userId)
    if (!checkReceivedUser) {
        return { message: 'user not found' }
    }
    const hasReceivedRequest = checkReceivedUser.receivedRequests.includes(data.friendId)
    return {
        message: 'received request check completed',
        hasReceivedRequest: hasReceivedRequest
    }
}

// Upload profile picture
const uploadProfilePicture = async (data) => {
    const { userId, pictureUrl } = data;
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: pictureUrl },
        { new: true });
    return { success: true, user: updatedUser }
}

// Delete profile picture
const deleteProfilePicture = async (data) => {
    const deleteUserPicture = await User.findByIdAndUpdate(
        data.userId,
        { profilePicture: null },
        { new: true }
    );
    if (!deleteUserPicture) {
        return { success: false, message: 'User not found' };
    }
    return {
        success: true,
        message: 'Profile picture deleted successfully',
        user: deleteUserPicture
    };
}

// Get notifications
const getNotifications = async (data) => {
    const userWithNotifications = await User.findById(data.userId);
    if (!userWithNotifications) {
        return { message: 'user not found' };
    }

    console.log('Fetching notifications for user:', data.userId);
    console.log('Total notifications found:', userWithNotifications.notifications.length);

    // Sort notifications by creation date (newest first)
    const sortedNotifications = userWithNotifications.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Sorted notifications:', sortedNotifications.map(n => ({ type: n.type, message: n.message })));

    return {
        message: 'notifications retrieved successfully',
        notifications: sortedNotifications
    };
}

// Dismiss notification
const dismissNotification = async (data) => {
    await User.findByIdAndUpdate(
        data.userId,
        { $pull: { notifications: { _id: data.notificationId } } }
    );
    return { message: 'notification dismissed successfully' };
}


module.exports = {
    createUser,
    listUsers,
    searchUsers,
    updateUser,
    deleteUser,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    getFriendRequests,
    removeFriend,
    getFriends,
    getUser,
    updateBio,
    getBio,
    checkPendingRequest,
    checkReceivedRequest,
    uploadProfilePicture,
    deleteProfilePicture,
    getNotifications,
    dismissNotification
}