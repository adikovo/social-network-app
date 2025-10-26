
const express = require("express");
const router = express.Router();
const { handlePostCommand, uploadPostImage } = require("../controllers/postController");
const multer = require("multer");

//configure multer for file uploads
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        //create a unique file name for the uploaded image
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'post-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
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

//endpoint for CRUD operations
router.post("/", handlePostCommand);

//endpoint for image uploads
router.post("/upload-image", upload.single('image'), uploadPostImage);

module.exports = router;
