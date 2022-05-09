const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const CustomerAppModel = new Schema({
    createdBy: {
        type: ObjectId,
        required: true,
        ref: 'admins'
    },
    updatedBy: {
        type: ObjectId,
        required: true,
        ref: 'admins'
    },
    customer: {
        type: ObjectId,
        required: true,
        ref: 'customers'
    },
    app: {
        type: ObjectId,
        required: true,
        ref: 'apps'
    },
    username: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED', 'DANGER', 'HACKED'],
        default: 'ACTIVE'
    },
    profilePic: {
        type: String,
        default: ''
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
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const CustomerApp = mongoose.model('customerApp', CustomerAppModel);
module.exports = CustomerApp;
