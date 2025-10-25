
const mongoose = require('mongoose');

//structure of post document in the db
const postSchema = new mongoose.Schema({
    content: String,
    author: String,
    authorId: String,
    authorProfilePicture: String,
    groupId: String,
    images: [String],
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    likedBy: [String],
    comments: Array
});

//post describes one document in db
const Post = mongoose.model('Post', postSchema);

module.exports = Post;