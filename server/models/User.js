
const mongoose = require('mongoose');


//structure of user document in the db
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 100,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
        maxlength: 20
    },
    friends: Array,
    groups: Array,
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notifications: [{
        type: {
            type: String,
            enum: ['joinGroupApproved', 'joinGroupDeclined', 'friendRequestAccepted', 'adminPromoted']
        },
        fromUserId: String,
        fromUserName: String,
        fromUserProfilePicture: String,
        groupId: String,
        groupName: String,
        message: String,
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }],
    profilePicture: {
        type: String,
        default: '/images/default-avatar.png'
    },
    // Bio fields for roommates application
    bio: {
        age: {
            type: Number,
            min: 18,
            max: 100
        },
        occupation: {
            type: String,
            maxlength: 100,
            trim: true
        },
        budget: {
            type: String,
            maxlength: 50,
            trim: true
        },
        location: {
            type: String,
            maxlength: 100,
            trim: true
        },
        lifestyle: {
            smoking: {
                type: String,
                enum: ["yes", "no", "occasionally"],
                maxlength: 20
            },
            pets: {
                type: String,
                enum: ["yes", "no", "allergic"],
                maxlength: 20
            },
            partying: {
                type: String,
                enum: ["frequent", "occasional", "rarely", "never"],
                maxlength: 20
            },
            cleanliness: {
                type: String,
                enum: ["very clean", "clean", "average", "messy"],
                maxlength: 20
            },
            sleepSchedule: {
                type: String,
                enum: ["early bird", "night owl", "flexible"],
                maxlength: 20
            }
        },
        preferences: {
            gender: {
                type: String,
                enum: ["male", "female", "any"],
                maxlength: 20
            },
            ageRange: {
                type: String,
                enum: ["18-25", "26-35", "36+", "any"],
                maxlength: 20
            },
            smokingPreference: {
                type: String,
                enum: ["smoker", "non-smoker", "any"],
                maxlength: 20
            },
            petPreference: {
                type: String,
                enum: ["pet-friendly", "no pets", "any"],
                maxlength: 20
            }
        },
        aboutMe: {
            type: String,
            maxlength: 1000,
            trim: true
        },
        lookingFor: {
            type: String,
            maxlength: 1000,
            trim: true
        }
    }
})

//user describes one document in db
const User = mongoose.model('User', userSchema)

module.exports = User;  