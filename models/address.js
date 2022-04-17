const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressModel = new Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'customers'
    },
    lat: {
        type: String
    },
    long: {
        type: String
    },
    country: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    consignee: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    countryCode: {
        type: String,
        default: ''
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
const Address = mongoose.model('Addresses', AddressModel);
module.exports = Address;
