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
                    authorProfilePicture: data.authorProfilePicture,
                    groupId: data.groupId,
                    images: data.images || [],
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
                const postToUpdate = await Post.findById(data.postId)
                if (!postToUpdate) {
                    return res.json({ message: 'post not found' })
                }

                // Prepare update object
                const updateData = { content: data.newContent }

                // Handle image removal if provided
                if (data.removedImages && Array.isArray(data.removedImages) && data.removedImages.length > 0) {
                    if (postToUpdate.images && postToUpdate.images.length > 0) {
                        // Filter out removed images
                        updateData.images = postToUpdate.images.filter((_, index) => !data.removedImages.includes(index))

                        // If no images left, set to empty array
                        if (updateData.images.length === 0) {
                            updateData.images = []
                        }
                    }
                }

                const updatePost = await Post.findByIdAndUpdate(
                    data.postId,
                    updateData,
                    { new: true }
                )

                return res.json({ message: 'post found & updated successfully', post: updatePost })
            case 'delete':
                //find post by id first to check if user is authorized to delete it
                const postToDelete = await Post.findById(data.postId)
                if (!postToDelete) {
                    return res.json({ message: 'post not found' })
                }

                //check if the user is the author of the post
                if (postToDelete.authorId !== data.userId) {
                    return res.status(403).json({ message: 'unauthorized: you can only delete your own posts' })
                }

                //delete the post if user is authorized
                const deletePost = await Post.findByIdAndDelete(data.postId)
                return res.json({ message: 'post deleted successfully', post: deletePost })

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

            case 'comment':
                //handle adding a comment to a post
                const commentPost = await Post.findById(data.postId);
                if (!commentPost) {
                    return res.json({ message: 'post not found' })
                }

                //create new comment object
                const newComment = {
                    content: data.commentText,
                    author: data.author,
                    authorId: data.userId,
                    authorProfilePicture: data.authorProfilePicture,
                    createdAt: new Date()
                };

                //add comment to post comments array
                const updatedCommentPost = await Post.findByIdAndUpdate(
                    data.postId,
                    { $push: { comments: newComment } },
                    { new: true }
                );

                return res.json({
                    message: 'comment added successfully',
                    post: updatedCommentPost
                })

            case 'edit comment':
                //handle editing a comment
                const editPost = await Post.findById(data.postId);
                if (!editPost) {
                    return res.json({ message: 'post not found' })
                }

                //find and update the comment
                const commentIndex = editPost.comments.findIndex(comment =>
                    comment.createdAt && comment.createdAt.toISOString() === data.commentId
                );

                if (commentIndex === -1) {
                    return res.json({ message: 'comment not found' })
                }

                //update the comment content
                editPost.comments[commentIndex].content = data.newContent;
                editPost.comments[commentIndex].updatedAt = new Date();

                //save the updated post
                const updatedEditPost = await editPost.save();

                return res.json({
                    message: 'comment edited successfully',
                    post: updatedEditPost
                })

            case 'delete comment':
                //handle deleting a comment
                const deleteCommentPost = await Post.findById(data.postId);
                if (!deleteCommentPost) {
                    return res.json({ message: 'post not found' })
                }

                //find and remove the comment
                const deleteCommentIndex = deleteCommentPost.comments.findIndex(comment =>
                    comment.createdAt && comment.createdAt.toISOString() === data.commentId
                );

                if (deleteCommentIndex === -1) {
                    return res.json({ message: 'comment not found' })
                }

                //remove the comment from the array
                deleteCommentPost.comments.splice(deleteCommentIndex, 1);

                //save the updated post
                const updatedDeletePost = await deleteCommentPost.save();

                return res.json({
                    message: 'comment deleted successfully',
                    post: updatedDeletePost
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

        console.log('Image uploaded successfully:', {
            originalName: uploadedFile.originalname,
            filename: uploadedFile.filename,
            size: uploadedFile.size,
            mimetype: uploadedFile.mimetype,
            imageUrl: imageUrl,
            userId: req.body.userId,
            groupId: req.body.groupId || null
        });

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

module.exports = { handlePostCommand, uploadPostImage }