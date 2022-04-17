const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ContactFormModel = new Schema({
    name: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    message: {
        type: String,
        default: "",
        trim: true
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
const ContactForm = mongoose.model('ContactForm', ContactFormModel);
module.exports = ContactForm;
