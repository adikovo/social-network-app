
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
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
} = require("../controllers/userController");
const User = require("../models/User");

//configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        //check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed!'), false)
        }
    }
});

//endpoint to get user by ID
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('name email profilePicture');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

//endpoint for profile picture upload
router.post("/upload-profile-picture", upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        //create the file URL
        const fileUrl = `/uploads/${req.file.filename}`;

        //update user's profile picture in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: fileUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Profile picture uploaded successfully',
            user: updatedUser,
            fileUrl: fileUrl
        });

    } catch (error) {
        console.error('Profile picture upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading profile picture',
            error: error.message
        });
    }
});

//endpoint to create a new user
router.post("/create", async (req, res) => {
    try {
        const result = await createUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user:', error: error.message });
    }
});

//endpoint to list all users
router.post("/list", async (req, res) => {
    try {
        const result = await listUsers(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error listing users:', error: error.message });
    }
});

//endpoint to search for users
router.post("/search", async (req, res) => {
    try {
        const result = await searchUsers(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users:', error: error.message });
    }
});

//endpoint to update a user
router.post("/update", async (req, res) => {
    try {
        const result = await updateUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user:', error: error.message });
    }
});

//endpoint to delete a user
router.post("/delete", async (req, res) => {
    try {
        const result = await deleteUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user:', error: error.message });
    }
});

//endpoint to send a friend request
router.post("/send-friend-request", async (req, res) => {
    try {
        const result = await sendFriendRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request:', error: error.message });
    }
});

//endpoint to accept a friend request
router.post("/accept-friend-request", async (req, res) => {
    try {
        const result = await acceptFriendRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request:', error: error.message });
    }
});

//endpoint to decline a friend request
router.post("/decline-friend-request", async (req, res) => {
    try {
        const result = await declineFriendRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error declining friend request:', error: error.message });
    }
});

//endpoint to cancel a friend request
router.post("/cancel-friend-request", async (req, res) => {
    try {
        const result = await cancelFriendRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling friend request:', error: error.message });
    }
});

//endpoint to get all friend requests
router.post("/friend-requests", async (req, res) => {
    try {
        const result = await getFriendRequests(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting friend requests:', error: error.message });
    }
});

//endpoint to remove a friend
router.post("/remove-friend", async (req, res) => {
    try {
        const result = await removeFriend(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error removing friend:', error: error.message });
    }
});

//endpoint to get all friends
router.post("/friends", async (req, res) => {
    try {
        const result = await getFriends(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting friends:', error: error.message });
    }
});

//endpoint to get a user by ID
router.post("/get", async (req, res) => {
    try {
        const result = await getUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting user:', error: error.message });
    }
});

//endpoint to update a user's bio
router.post("/update-bio", async (req, res) => {
    try {
        const result = await updateBio(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating bio:', error: error.message });
    }
});

//endpoint to get a user's bio
router.post("/bio", async (req, res) => {
    try {
        const result = await getBio(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting bio:', error: error.message });
    }
});

//endpoint to check for pending friend requests
router.post("/check-pending-request", async (req, res) => {
    try {
        const result = await checkPendingRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error checking pending request:', error: error.message });
    }
});

//endpoint to check for received friend requests
router.post("/check-received-request", async (req, res) => {
    try {
        const result = await checkReceivedRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error checking received request:', error: error.message });
    }
});

//endpoint to upload a profile picture
router.post("/upload-profile-picture-url", async (req, res) => {
    try {
        const result = await uploadProfilePicture(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile picture:', error: error.message });
    }
});

//endpoint to delete a profile picture
router.post("/delete-profile-picture", async (req, res) => {
    try {
        const result = await deleteProfilePicture(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile picture:', error: error.message });
    }
});

//endpoint to get all notifications
router.post("/notifications", async (req, res) => {
    try {
        const result = await getNotifications(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting notifications:', error: error.message });
    }
});

//endpoint to dismiss a notification
router.post("/dismiss-notification", async (req, res) => {
    try {
        const result = await dismissNotification(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error dismissing notification:', error: error.message });
    }
});

module.exports = router;