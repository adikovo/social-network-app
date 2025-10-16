
const mongoose = require("mongoose");

//connect to the db
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://adi:4c17ebfe3694@cluster0.aepldsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
      .then(() => {
        console.log("MongoDB connected")
      })
  } catch (error) {
    console.error("error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
