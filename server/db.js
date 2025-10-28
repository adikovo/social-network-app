
const mongoose = require("mongoose");
require('dotenv').config();

//connect to the db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("MongoDB connected")
      })
  } catch (error) {
    console.error("error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
