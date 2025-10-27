const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const fs = require('fs')
const connectDB = require('./db')
const { initSocket } = require('./socket')
const userRoutes = require('./routes/userRoutes')
const groupRoutes = require('./routes/groupRoutes')
const postRoutes = require('./routes/postRoutes')
const authRoutes = require('./routes/authRoutes')
const feedRoutes = require('./routes/feedRoutes')
const conversationRoutes = require('./routes/conversationRoute')
const messageRoutes = require('./routes/messageRoutes')

const app = express()
const server = http.createServer(app)

//initialize Socket.io
const io = initSocket(server)

//ability to accept json data & cross origin requests
app.use(cors())
app.use(bodyParser.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

connectDB()

//routes
app.use("/api/users", userRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/feed", feedRoutes)
app.use("/api/conversations", conversationRoutes)
app.use("/api/messages", messageRoutes)

const PORT = 3001
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})