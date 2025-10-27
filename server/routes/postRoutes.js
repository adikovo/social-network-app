const express = require("express");
const router = express.Router();
const {
    createPost,
    listPosts,
    searchPosts,
    updatePost,
    deletePost,
    likePost,
    addComment,
    editComment,
    deleteComment,
    uploadPostImage,
    uploadPostVideo
} = require("../controllers/postController");
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
        // Check if file is an image
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
        // 50MB limit for videos
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        // Check if file is a video
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

// Create a new post
router.post("/", async (req, res) => {
    try {
        const result = await createPost(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post:', error: error.message });
    }
});

// List all posts
router.get("/", async (req, res) => {
    try {
        const result = await listPosts(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error listing posts:', error: error.message });
    }
});

// Search posts
router.get("/search", async (req, res) => {
    try {
        const result = await searchPosts(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error searching posts:', error: error.message });
    }
});

// Update a post
router.put("/", async (req, res) => {
    try {
        const result = await updatePost(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post:', error: error.message });
    }
});

// Delete a post
router.delete("/", async (req, res) => {
    try {
        const result = await deletePost(req.body);
        res.json(result);
    } catch (error) {
        if (error.message.includes('unauthorized')) {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error deleting post:', error: error.message });
        }
    }
});

// Like/unlike a post
router.put("/like", async (req, res) => {
    try {
        const result = await likePost(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post like:', error: error.message });
    }
});

// Add a comment to a post
router.post("/comment", async (req, res) => {
    try {
        const result = await addComment(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment:', error: error.message });
    }
});

// Edit a comment
router.put("/comment", async (req, res) => {
    try {
        const result = await editComment(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error editing comment:', error: error.message });
    }
});

// Delete a comment
router.delete("/comment", async (req, res) => {
    try {
        const result = await deleteComment(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment:', error: error.message });
    }
});

// Upload image for posts
router.post("/upload-image", uploadImage.single('image'), uploadPostImage);

// Upload video for posts
router.post("/upload-video", uploadVideo.single('video'), uploadPostVideo);

module.exports = router;