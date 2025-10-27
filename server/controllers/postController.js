const Post = require("../models/Post");
const Group = require("../models/Group");

// Create a new post
const createPost = async (data) => {
    const newPost = new Post({
        content: data.content,
        author: data.author,
        authorId: data.authorId,
        authorProfilePicture: data.authorProfilePicture,
        groupId: data.groupId,
        images: data.images || [],
        videos: data.videos || [],
        likes: 0,
        comments: []
    });

    await newPost.save();
    return { message: 'post inserted successfully', post: newPost };
};

// List all posts
const listPosts = async (data) => {
    const posts = await Post.find({});
    return { message: 'all posts fetched successfully', posts: posts };
};

// Search posts with multiple parameters
const searchPosts = async (data) => {
    const { author, fromDate, toDate, group, content, groupId } = data;
    const postSearchQuery = {};

    // Build search query based on provided parameters
    if (author) {
        postSearchQuery.author = { $regex: author, $options: 'i' };
    }
    if (fromDate || toDate) {
        // Search for posts within a date range
        const dateQuery = {};

        if (fromDate) {
            const startDate = new Date(fromDate);
            startDate.setHours(0, 0, 0, 0);
            dateQuery.$gte = startDate;
        }

        if (toDate) {
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            dateQuery.$lte = endDate;
        }

        postSearchQuery.createdAt = dateQuery;
    }
    if (groupId) {
        // Search posts by specific group ID
        postSearchQuery.groupId = groupId;
    }
    if (group) {
        // Find groups matching the name
        const matchingGroups = await Group.find({
            name: { $regex: group, $options: 'i' }
        }).select('_id');

        // Extract group IDs
        const groupIds = matchingGroups.map(g => g._id.toString());

        // Search posts by group IDs
        if (groupIds.length > 0) {
            postSearchQuery.groupId = { $in: groupIds };
        } else {
            postSearchQuery.groupId = { $in: [] };
        }
    }
    if (content) {
        // Search for posts by content
        postSearchQuery.content = { $regex: content, $options: 'i' };
    }

    // Sort posts by creation time in descending order
    const postSearchResults = await Post.find(postSearchQuery).sort({ createdAt: -1 });

    return {
        message: 'post search completed successfully',
        posts: postSearchResults,
        searchCriteria: postSearchQuery
    };
};

// Update a post
const updatePost = async (data) => {
    const postToUpdate = await Post.findById(data.postId);
    if (!postToUpdate) {
        return { message: 'post not found' };
    }

    // Prepare update object
    const updateData = { content: data.newContent };

    // Handle image removal if provided
    if (data.removedImages && Array.isArray(data.removedImages) && data.removedImages.length > 0) {
        if (postToUpdate.images && postToUpdate.images.length > 0) {
            // Filter out removed images
            updateData.images = postToUpdate.images.filter((_, index) => !data.removedImages.includes(index));

            // If no images left, set to empty array
            if (updateData.images.length === 0) {
                updateData.images = [];
            }
        }
    }

    // Handle video removal if provided
    if (data.removedVideos && Array.isArray(data.removedVideos) && data.removedVideos.length > 0) {
        if (postToUpdate.videos && postToUpdate.videos.length > 0) {
            // Filter out removed videos
            updateData.videos = postToUpdate.videos.filter((_, index) => !data.removedVideos.includes(index));

            // If no videos left, set to empty array
            if (updateData.videos.length === 0) {
                updateData.videos = [];
            }
        }
    }

    const updatePost = await Post.findByIdAndUpdate(
        data.postId,
        updateData,
        { new: true }
    );

    return { message: 'post found & updated successfully', post: updatePost };
};

// Delete a post
const deletePost = async (data) => {
    const postToDelete = await Post.findById(data.postId);
    if (!postToDelete) {
        return { message: 'post not found' };
    }

    // Check if the user is the author of the post
    if (postToDelete.authorId !== data.userId) {
        throw new Error('unauthorized: you can only delete your own posts');
    }

    // Delete the post if user is authorized
    const deletedPost = await Post.findByIdAndDelete(data.postId);
    return { message: 'post deleted successfully', post: deletedPost };
};

// Like or unlike a post
const likePost = async (data) => {
    const post = await Post.findById(data.postId);
    if (!post) {
        return { message: 'post not found' };
    }

    let updatedLikedBy = [...(post.likedBy || [])];
    let newLikeCount = post.likes;

    if (data.isLiked) {
        // Like on post - add user to likedBy array 
        if (!updatedLikedBy.includes(data.userId)) {
            updatedLikedBy.push(data.userId);
            newLikeCount = post.likes + 1;
        }
    } else {
        // Unlike post - remove user from likedBy array
        updatedLikedBy = updatedLikedBy.filter(id => id !== data.userId);
        newLikeCount = Math.max(0, post.likes - 1);
    }

    // Update post with new likes count and likedBy array
    const updatedPost = await Post.findByIdAndUpdate(
        data.postId,
        {
            likes: newLikeCount,
            likedBy: updatedLikedBy
        },
        { new: true }
    );
    return { message: 'post like updated', post: updatedPost };
};

// Add a comment to a post
const addComment = async (data) => {
    const commentPost = await Post.findById(data.postId);
    if (!commentPost) {
        return { message: 'post not found' };
    }

    // Create new comment object
    const newComment = {
        content: data.commentText,
        author: data.author,
        authorId: data.userId,
        authorProfilePicture: data.authorProfilePicture,
        createdAt: new Date()
    };

    // Add comment to post comments array
    const updatedCommentPost = await Post.findByIdAndUpdate(
        data.postId,
        { $push: { comments: newComment } },
        { new: true }
    );

    return {
        message: 'comment added successfully',
        post: updatedCommentPost
    };
};

// Edit a comment
const editComment = async (data) => {
    const editPost = await Post.findById(data.postId);
    if (!editPost) {
        return { message: 'post not found' };
    }

    // Find and update the comment
    const commentIndex = editPost.comments.findIndex(comment =>
        comment.createdAt && comment.createdAt.toISOString() === data.commentId
    );

    if (commentIndex === -1) {
        return { message: 'comment not found' };
    }

    // Update the comment content
    editPost.comments[commentIndex].content = data.newContent;
    editPost.comments[commentIndex].updatedAt = new Date();

    // Save the updated post
    const updatedEditPost = await editPost.save();

    return {
        message: 'comment edited successfully',
        post: updatedEditPost
    };
};

// Delete a comment
const deleteComment = async (data) => {
    const deleteCommentPost = await Post.findById(data.postId);
    if (!deleteCommentPost) {
        return { message: 'post not found' };
    }

    // Find and remove the comment
    const deleteCommentIndex = deleteCommentPost.comments.findIndex(comment =>
        comment.createdAt && comment.createdAt.toISOString() === data.commentId
    );

    if (deleteCommentIndex === -1) {
        return { message: 'comment not found' };
    }

    // Remove the comment from the array
    deleteCommentPost.comments.splice(deleteCommentIndex, 1);

    // Save the updated post
    const updatedDeletePost = await deleteCommentPost.save();

    return {
        message: 'comment deleted successfully',
        post: updatedDeletePost
    };
};

// Handle image upload for posts
const uploadPostImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        if (!req.body.userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Get the uploaded file information
        const uploadedFile = req.file;
        const imageUrl = `/uploads/${uploadedFile.filename}`;

        // Return success response with image URL
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: uploadedFile.filename,
            size: uploadedFile.size,
            mimetype: uploadedFile.mimetype
        });

    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image: ' + error.message
        });
    }
};

// Handle video upload for posts
const uploadPostVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided'
            });
        }

        if (!req.body.userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Get the uploaded file information
        const uploadedFile = req.file;
        const videoUrl = `/uploads/${uploadedFile.filename}`;

        // Return success response with video URL
        res.json({
            success: true,
            message: 'Video uploaded successfully',
            videoUrl: videoUrl,
            filename: uploadedFile.filename,
            size: uploadedFile.size,
            mimetype: uploadedFile.mimetype
        });

    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload video: ' + error.message
        });
    }
};

module.exports = {
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
};