const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')
const connectDB = require('./db')
const initSocket = require('./socket')
const userRoutes = require('./routes/userRoutes')
const groupRoutes = require('./routes/groupRoutes')
const postRoutes = require('./routes/postRoutes')
const authRoutes = require('./routes/authRoutes')
const feedRoutes = require('./routes/feedRoutes')

const app = express()
const server = http.createServer(app)

//initialize Socket.io
const io = initSocket(server)

//ability to accept json data & cross origin requests
app.use(cors())
app.use(bodyParser.json())

connectDB()

//routes
app.use("/api/users", userRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/feed", feedRoutes)


const PORT = 3001
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})