const Post = require("../models/Post");

//api endpoint to handle all CRUD operations
const handlePostCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'insert':
                //create new post document
                const newPost = new Post({ content: data.content, author: data.author, likes: 0, comments: [] })

                //save post to db as new document
                await newPost.save()
                return res.json({ message: 'post inserted successfully', post: newPost })                           
            case 'select':
                //fetch all posts from db
                const posts = await Post.find({})
                return res.json({ message: 'all posts fetched successfully', posts: posts })                
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