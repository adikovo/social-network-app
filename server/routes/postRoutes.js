
const express = require("express");
const router = express.Router();
const { handlePostCommand, uploadPostImage, uploadPostVideo } = require("../controllers/postController");
const multer = require("multer");

//configure multer for file uploads
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        //create a unique file name for the uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'post-' + uniqueSuffix + '-' + file.originalname);
    }
});

// Multer configuration for images
const uploadImage = multer({
    storage: storage,
    limits: {
        // 5MB limit
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        //check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Multer configuration for videos
const uploadVideo = multer({
    storage: storage,
    limits: {
        //50MB limit for videos
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        //heck if file is a video
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

//endpoint for CRUD operations
router.post("/", handlePostCommand);

//endpoint for image uploads
router.post("/upload-image", uploadImage.single('image'), uploadPostImage);

//endpoint for video uploads
router.post("/upload-video", uploadVideo.single('video'), uploadPostVideo);

module.exports = router;
