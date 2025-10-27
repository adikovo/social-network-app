
const mongoose = require('mongoose');

// Video schema for embedded video objects
const videoSchema = new mongoose.Schema({
    url: String,
    type: String, // 'youtube' or 'uploaded'
    filename: String,
    videoId: String,
    originalUrl: String
}, { _id: false });

//structure of post document in the db
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        maxlength: 2000,
        trim: true
    },
    author: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    authorId: {
        type: String,
        required: true,
        maxlength: 50
    },
    authorProfilePicture: {
        type: String,
        maxlength: 200
    },
    groupId: {
        type: String,
        maxlength: 50
    },
    images: [String],
    videos: [videoSchema],
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    likedBy: [String],
    comments: Array
});

//post describes one document in db
const Post = mongoose.model('Post', postSchema);

module.exports = Post;