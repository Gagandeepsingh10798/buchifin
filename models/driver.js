const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DriverModel = new Schema({
    profileStatus: {
        type: Number,
        default: 0
    },
    profilePic: {
        type: String,
        default: ''
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
    isEmailVerify: {
        type: Boolean,
        default: false
    },
    isPhoneVerify: {
        type: Boolean,
        default: false
    },
    sst: {
        type: String,
        trim: true,
        default: '09:00 AM'
    },
    est: {
        type: String,
        trim: true,
        default: '06:00 PM'
    },
    onBreak: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    lat: {
        type: String
    },
    long: {
        type: String
    },
    facebookId: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    deviceType: {
        type: String,
        enum: ['IOS', 'ANDROID', 'WEB']
    },
    deviceToken: {
        type: String,
        default: ''
    },
    residentalAddress: {
        type: String,
        trim: true,
        default: ''
    },
    accountNumber: {
        type: String,
        trim: true,
        default: ''
    },
    accountName: {
        type: String,
        trim: true,
        default: ''
    },
    accountType: {
        type: String,
        trim: true,
        default: ''
    },
    bankName: {
        type: String,
        trim: true,
        default: ''
    },
    ifsc: {
        type: String,
        trim: true,
        default: ''
    },
    bio: {
        type: String,
        trim: true,
        default: ''
    },
    documents: [
        {
            type: String
        }
    ],
    isAssigned: {
        type: Boolean,
        default: false
    },
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const Driver = mongoose.model('Driver', DriverModel);
module.exports = Driver;
