const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const FuelProductModel = new Schema({
    price: {
        type: Number,
        required: true
    },
    category: {
        type: ObjectId,
        required: true,
        ref: 'fuelcategories'
    },
    capacity: {
        type: Number,
        required: true,
    },
    dimension: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        default: "regular"
    },
    location: {
        type: String,
        trim: true,
        required: true,
    },
    lat: {
        type: String
    },
    long: {
        type: String
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
const FuelProduct = mongoose.model('fuelproducts', FuelProductModel);
module.exports = FuelProduct;
