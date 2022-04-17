const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomerModel = new Schema({
    profileStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
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
    walletBalance: {
        type: Number,
        default: 0
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
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const Customer = mongoose.model('Customer', CustomerModel);
module.exports = Customer;
