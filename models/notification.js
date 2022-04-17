const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationModel = new Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    image: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const Notification = mongoose.model('Notification', NotificationModel);
module.exports = Notification;
