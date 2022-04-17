const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleModel = new Schema({
    dimension: {
        height: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        }
    },
    capacity: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'vehiclecategories'
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
const Vehicle = mongoose.model('vehicles', VehicleModel);
module.exports = Vehicle;
