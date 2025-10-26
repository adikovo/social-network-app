
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { handleUserCommand } = require("../controllers/userController");
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

//endpoint for CRUD operations
router.post("/", handleUserCommand);

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


module.exports = router;