
const mongoose = require("mongoose");

//connect to the db
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/social-network")
    .then(() => {
      console.log("MongoDB connected")
    })
  } catch (error) {
    console.error("error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
