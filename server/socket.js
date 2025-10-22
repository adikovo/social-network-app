import { Server } from "socket.io";

//initialize Socket.io server
const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

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
        socket.on('send-message', (data) => {
            const { senderId, receiverId, senderName, message } = data

            const messageData = {
                senderId: senderId,
                senderName: senderName,
                message: message,
                timestamp: new Date()
            }

            //send message to the receiver's personal room
            socket.to(`user-${receiverId}`).emit('receive-message', messageData)
            console.log(`Private message from ${senderName} (${senderId}) to user ${receiverId}: ${message}`)
        })

        //handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
        })
    })

    return io;
};

module.exports = initSocket;
