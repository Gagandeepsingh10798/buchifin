const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AppCategoryModel = new Schema({
    name: {
        type: String,
        default: '',
        unique: true
    },
    icon: {
        type: String,
        default: 'icon.jpg'
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
const AppCategory = mongoose.model('appcategories', AppCategoryModel);
module.exports = AppCategory;
