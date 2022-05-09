const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const AppModel = new Schema({
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
    name: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
    },
    icon: {
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
const App = mongoose.model('App', AppModel);
module.exports = App;
