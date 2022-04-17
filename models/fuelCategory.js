const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FuelCategoryModel = new Schema({
    image: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const FuelCategory = mongoose.model('fuelcategories', FuelCategoryModel);
module.exports = FuelCategory;
