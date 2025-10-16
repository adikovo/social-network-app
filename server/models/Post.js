
const mongoose = require('mongoose');

//structure of post document in the db
const postSchema = new mongoose.Schema({
    content: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
    likes: Number,
    comments: Array
});

//post describes one document in db
const Post = mongoose.model('Post', postSchema);

module.exports = Post;