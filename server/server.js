const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./db')
const userRoutrs = require('./routes/userRoutes')


const app = express()

//ability to accept json data & cross origin requests
app.use(cors())
app.use(bodyParser.json())

connectDB()

//routes
app.use("/api/users", userRoutrs)

const PORT = 5000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})