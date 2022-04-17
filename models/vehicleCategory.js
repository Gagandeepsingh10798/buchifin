const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleCategoryModel = new Schema({
    capacity: {
        type: Number,
        required: true
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
const VehicleCategory = mongoose.model('vehiclecategories', VehicleCategoryModel);
module.exports = VehicleCategory;
