const Post = require("../models/Post");

//api endpoint to handle all CRUD operations
const handlePostCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'create':
                //create new post document
                const newPost = new Post({ content: data.content, author: data.author, likes: 0, comments: [] })

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

            case 'getFeed':
                //get posts from user's friends and joined groups
                const User = require("../models/User")
                const Group = require("../models/Group")

                const feedUser = await User.findById(data.userId)
                if (!feedUser) {
                    return res.json({ message: 'user not found' })
                }

                //get posts from friends
                const friendPosts = await Post.find({ author: { $in: feedUser.friends } })

                //get posts from user's groups
                const userGroups = await Group.find({ _id: { $in: feedUser.groups } })
                const groupIds = userGroups.map(group => group._id.toString())
                const groupPosts = await Post.find({ groupId: { $in: groupIds } })

                //combine and sort by creation date
                const allFeedPosts = [...friendPosts, ...groupPosts]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                return res.json({
                    message: 'feed retrieved successfully',
                    posts: allFeedPosts
                })

            case 'getPostsByGroup':
                //get all posts in a specific group
                const postsByGroup = await Post.find({ groupId: data.groupId })
                    .sort({ createdAt: -1 })
                return res.json({
                    message: 'group posts retrieved successfully',
                    posts: postsByGroup
                })

            case 'getPostsByAuthor':
                //get all posts by specific user
                const authorPosts = await Post.find({ author: data.authorId })
                    .sort({ createdAt: -1 })
                return res.json({
                    message: 'author posts retrieved successfully',
                    posts: authorPosts
                })

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