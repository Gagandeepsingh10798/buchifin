const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NewsModel = new Schema({
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
    icon: {
        type: String,
        default: ''
    },
    heading: {
        type: String,
        default: ''
    },
    subHeading: {
        type: String,
        default: ''
    },
    body: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
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
const News = mongoose.model('News', NewsModel);
module.exports = News;
