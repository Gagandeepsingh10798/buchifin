const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BankModel = new Schema({
    name: {
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
const Bank = mongoose.model('Banks', BankModel);
module.exports = Bank;
