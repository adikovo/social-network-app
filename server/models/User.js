
const mongoose = require('mongoose');


//structure of user document in the db
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    friends: Array,
    groups: Array,
    // Bio fields for roommates application
    bio: {
        age: Number,
        occupation: String,
        budget: String,
        location: String,
        lifestyle: {
            smoking: String, // "yes", "no", "occasionally"
            pets: String,    // "yes", "no", "allergic"
            partying: String, // "frequent", "occasional", "rarely", "never"
            cleanliness: String, // "very clean", "clean", "average", "messy"
            sleepSchedule: String // "early bird", "night owl", "flexible"
        },
        preferences: {
            gender: String,  // "male", "female", "any"
            ageRange: String, // "18-25", "26-35", "36+", "any"
            smokingPreference: String, // "smoker", "non-smoker", "any"
            petPreference: String // "pet-friendly", "no pets", "any"
        },
        aboutMe: String,
        lookingFor: String
    }
})

//user describes one document in db
const User = mongoose.model('User', userSchema)

module.exports = User;  