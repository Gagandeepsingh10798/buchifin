const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BookingModel = new Schema({
    bookingId:{
        type: String,
        default: `#${Date.now()}`,
        unique: true
    },
    customer: {
        type: ObjectId,
        ref: 'customers'
    },
    vehicle: {
        type: ObjectId,
        ref: 'vehicles'
    },
    driver: {
        type: ObjectId,
        ref: 'drivers'
    },
    product: {
        type: ObjectId,
        ref: 'fuelproducts'
    },
    bookingType: {
        type: String,
        enum: ["NOW", "SHEDULED"],
        default: "NOW"
    },
    deliveryTime: {
        type: String
    },
    deliveryAddress: {
        type: ObjectId,
        ref: 'addresses'
    },
    deliveryDistance: {
        type: String
    },
    date: {
        type: Date,
        default: new Date()
    },
    amount: {
        type: Number
    },
    promo: {
        type: ObjectId,
        ref: 'promo'
    },
    status: {
        type: Number,
        default: 0 // 1: accept, 6: reject, 2: loaded, 3: dispatched,  4: arrived, 5: delivered
    },
    paymentType: {
        type: String,
        enum: ['CASH', 'CARD', 'WALLET']
    },
    sheduledDate:{
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    acceptedAt: {
        type: Date
    },
    loadedAt: {
        type: Date
    },
    dispatchedAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const Booking = mongoose.model('Booking', BookingModel);
module.exports = Booking;
