const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    },
    promo: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    validUpto: {
        type: Date,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("promo", promoSchema);

