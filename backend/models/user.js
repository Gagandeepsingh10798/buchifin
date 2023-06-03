const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = new Schema({
    address: {
        lat: {
            type: String,
            default: ''
        },
        lng: {
            type: String,
            default: ''
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        }
    },
    profilePic: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE']
    },
    firstName: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    countryCode: {
        type: String,
        trim: true,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    lat: {
        type: String,
        default: ''
    },
    lng: {
        type: String,
        default: ''
    },
    deviceType: {
        type: String,
        enum: ['IOS', 'ANDROID', 'WEB']
    },
    deviceToken: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['ADMIN', 'SUBADMIN', 'RETAILER', 'PARTNER', 'MANUFACTURER']
    },
    documents: {
        adhaar: {
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        },
        pan: {
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        }
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED', 'REJECTED'],
        default: 'ACTIVE'
    },
    dob: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const User = mongoose.model('User', UserModel);
module.exports = User;