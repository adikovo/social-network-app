const { Server } = require("socket.io");
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

// Store the io instance globally so it can be used in controllers
let ioInstance = null;

//initialize Socket.io server
const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Store the io instance globally
    ioInstance = io;

    //handle connection
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        //join user to their personal room for private messaging
        socket.on('join-user-room', (data) => {
            const { userId } = data
            socket.join(`user-${userId}`)
            console.log(`User ${userId} joined their personal room`)
        })

        //send private message between two users
        socket.on('send-message', async (data) => {
            try {
                const { senderId, receiverId, senderName, message } = data

                // Create conversationId by sorting user IDs
                const conversationId = [senderId, receiverId].sort().join('_')

                // Save message to database
                const newMessage = new Message({
                    senderId: senderId,
                    receiverId: receiverId,
                    content: message,
                    conversationId: conversationId,
                    timestamp: new Date(),
                    read: false
                })

                await newMessage.save()

                // Update or create conversation
                const conversation = await Conversation.findOneAndUpdate(
                    { conversationId: conversationId },
                    {
                        participants: [senderId, receiverId],
                        lastMessage: message,
                        lastMessageAt: new Date(),
                        lastMessageSender: senderId,
                        conversationId: conversationId
                    },
                    { upsert: true, new: true }
                )

                // Update unread counts for the receiver
                if (conversation.unreadCounts && conversation.unreadCounts.length > 0) {
                    // Find receiver's unread count entry
                    const receiverUnreadIndex = conversation.unreadCounts.findIndex(
                        unreadCount => unreadCount.userId.toString() === receiverId
                    );

                    if (receiverUnreadIndex !== -1) {
                        // Increment receiver's unread count
                        conversation.unreadCounts[receiverUnreadIndex].count += 1;
                    } else {
                        // Add new unread count entry for receiver
                        conversation.unreadCounts.push({ userId: receiverId, count: 1 });
                    }

                    // Ensure sender's unread count entry exists (but don't increment it)
                    const senderUnreadIndex = conversation.unreadCounts.findIndex(
                        unreadCount => unreadCount.userId.toString() === senderId
                    );

                    if (senderUnreadIndex === -1) {
                        conversation.unreadCounts.push({ userId: senderId, count: 0 });
                    }

                    await conversation.save();
                } else {
                    // Initialize unread counts array
                    conversation.unreadCounts = [
                        { userId: senderId, count: 0 },
                        { userId: receiverId, count: 1 }
                    ];
                    await conversation.save();
                }

                const messageData = {
                    senderId: senderId,
                    senderName: senderName,
                    message: message,
                    timestamp: new Date(),
                    conversationId: conversationId
                }

                //send message to the receiver's personal room
                socket.to(`user-${receiverId}`).emit('receive-message', messageData)
                console.log(`Private message from ${senderName} (${senderId}) to user ${receiverId}: ${message}`)
            } catch (error) {
                console.error('Error sending message:', error)
                socket.emit('message-error', { error: 'Failed to send message' })
            }
        })

        //handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
        })
    })

    return io;
};

// Function to emit notification to a specific user
const emitNotification = (userId, notificationData) => {
    if (ioInstance) {
        ioInstance.to(`user-${userId}`).emit('new-notification', notificationData);
        console.log(`Notification sent to user ${userId}`);
    }
};

module.exports = {
    initSocket,
    emitNotification
};
