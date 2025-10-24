const Post = require("../models/Post");

//api endpoint to handle all CRUD operations
const handlePostCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'create':
                //create new post document
                const newPost = new Post({
                    content: data.content,
                    author: data.author,
                    authorId: data.authorId,
                    groupId: data.groupId,
                    likes: 0,
                    comments: []
                })

                //save post to db as new document
                await newPost.save()
                return res.json({ message: 'post inserted successfully', post: newPost })
            case 'list':
                //fetch all posts from db
                const posts = await Post.find({})
                return res.json({ message: 'all posts fetched successfully', posts: posts })

            case 'search':
                //multi parameter search for posts
                const { author, date } = data
                const postSearchQuery = {}

                //build search query based on provided parameters
                if (author) {
                    postSearchQuery.author = author
                }
                if (date) {
                    //search for posts on a specific date
                    const searchDate = new Date(date)
                    const startOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate())
                    const endOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate() + 1)

                    postSearchQuery.createdAt = {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }
                //sort posts by creation time in descending order
                const postSearchResults = await Post.find(postSearchQuery).sort({ createdAt: -1 })
                return res.json({
                    message: 'post search completed successfully',
                    posts: postSearchResults,
                    searchCriteria: postSearchQuery
                })
            case 'update':
                //find post by id and update its content
                const updatePost = await Post.findByIdAndUpdate(
                    data.postId,
                    { content: data.newContent },
                    { new: true }
                )
                if (!updatePost) {
                    return res.json({ message: 'post not found' })
                }
                else {
                    return res.json({ message: 'post found & updated successfully', post: updatePost })
                }
            case 'delete':
                //find post by id and delete it
                const deletePost = await (Post.findByIdAndDelete(data.postId))
                if (!deletePost) {
                    return res.json({ message: 'post not found' })
                }
                else {
                    return res.json({ message: 'post deleted successfully', post: deletePost })
                }

            case 'like':
                //handle like or unlike
                const post = await Post.findById(data.postId);
                if (!post) {
                    return res.json({ message: 'post not found' })
                }

                let updatedLikedBy = [...(post.likedBy || [])];
                let newLikeCount = post.likes;

                if (data.isLiked) {
                    //like on post - add user to likedBy array 
                    if (!updatedLikedBy.includes(data.userId)) {
                        updatedLikedBy.push(data.userId);
                        newLikeCount = post.likes + 1;
                    }
                } else {
                    // unlike post -  remove user from likedBy array
                    updatedLikedBy = updatedLikedBy.filter(id => id !== data.userId);
                    newLikeCount = Math.max(0, post.likes - 1);
                }

                //update post with new likes count and likedBy array
                const updatedPost = await Post.findByIdAndUpdate(
                    data.postId,
                    {
                        likes: newLikeCount,
                        likedBy: updatedLikedBy
                    },
                    { new: true }
                );
                return res.json({ message: 'post like updated', post: updatedPost })

            //if command is not recognized
            default:
                return res.json({ message: 'invalid command' })
        }
    }
    catch (error) {
        return res.json({ message: 'Error handling post command:', error: error.message })
    }
}

module.exports = { handlePostCommand }