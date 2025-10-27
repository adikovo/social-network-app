const Post = require("../models/Post");
const User = require("../models/User");
const Group = require("../models/Group");

// Get posts from user's friends, joined groups, and user's own posts
const getFeed = async (data) => {
    const feedUser = await User.findById(data.userId);
    if (!feedUser) {
        throw new Error('user not found');
    }

    // Get user's own posts
    const userPosts = await Post.find({ authorId: data.userId });

    // Get posts from friends
    const friendPosts = await Post.find({ authorId: { $in: feedUser.friends } });

    // Get posts from user's groups
    const userGroups = await Group.find({ _id: { $in: feedUser.groups } });
    const groupIds = userGroups.map(group => group._id.toString());
    const groupPosts = await Post.find({ groupId: { $in: groupIds } });

    // Combine and deduplicate posts 
    const allFeedPosts = [...userPosts, ...friendPosts, ...groupPosts];

    // Remove duplicates based on post ID
    const uniquePosts = allFeedPosts.filter((post, index, self) =>
        index === self.findIndex(p => p._id.toString() === post._id.toString())
    );

    // Sort by creation date
    const sortedPosts = uniquePosts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Add group names to posts that have group id
    const postsWithGroupNames = await Promise.all(sortedPosts.map(async (post) => {
        if (post.groupId) {
            const group = await Group.findById(post.groupId);
            return {
                ...post.toObject(),
                groupName: group ? group.name : 'Unknown Group'
            };
        }
        return post.toObject();
    }));

    return {
        message: 'feed retrieved successfully',
        posts: postsWithGroupNames
    };
};

// Get all posts by specific user
const getPostsByAuthor = async (data) => {
    const authorPosts = await Post.find({ authorId: data.authorId })
        .sort({ createdAt: -1 });

    return {
        message: 'author posts retrieved successfully',
        posts: authorPosts
    };
};

// Get all posts by current user (for profile page)
const getUserPosts = async (data) => {
    const profileUserPosts = await Post.find({ authorId: data.userId })
        .sort({ createdAt: -1 });

    return {
        message: 'user posts retrieved successfully',
        posts: profileUserPosts
    };
};

module.exports = {
    getFeed,
    getPostsByAuthor,
    getUserPosts
};
