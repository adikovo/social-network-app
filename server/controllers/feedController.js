const Post = require("../models/Post");
const User = require("../models/User");
const Group = require("../models/Group");

//feed controller for handling user feeds and post aggregation
const handleFeedCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        switch (command) {
            case 'getFeed':
                //get posts from user's friends and joined groups
                const feedUser = await User.findById(data.userId)
                if (!feedUser) {
                    return res.json({ message: 'user not found' })
                }

                //get posts from friends
                const friendPosts = await Post.find({ authorId: { $in: feedUser.friends } })

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

            case 'getPostsByAuthor':
                //get all posts by specific user
                const authorPosts = await Post.find({ authorId: data.authorId })
                    .sort({ createdAt: -1 })
                return res.json({
                    message: 'author posts retrieved successfully',
                    posts: authorPosts
                })

            case 'getUserPosts':
                //get all posts by current user (for profile page)
                const userPosts = await Post.find({ authorId: data.userId })
                    .sort({ createdAt: -1 })
                return res.json({
                    message: 'user posts retrieved successfully',
                    posts: userPosts
                })

            default:
                return res.json({ message: 'invalid command' })
        }
    }
    catch (error) {
        return res.json({ message: 'Error handling feed command:', error: error.message })
    }
}

module.exports = { handleFeedCommand }
