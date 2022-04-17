const config = require("config");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const MONGOOSE_ENCRYPTION_KEY = config.get("MONGOOSE_ENCRYPTION_KEY");
const ObjectId = mongoose.Types.ObjectId;

const CardsModel = new Schema({
    customerId: {
        type: ObjectId,
        ref: 'customers'
    },
    fullName:{
        type: String,
        default: null
    },
    cardNumber:{
        type: String,
        default: null
    },
    cardId:{
        type: String,
        default: null
    },
    expireDate:{
        type: String,
        default:null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey:false
});

CardsModel.plugin(mongooseFieldEncryption,{fields: ["cardNumber", "expireDate"],secret: MONGOOSE_ENCRYPTION_KEY })
const Cards = mongoose.model('Cards', CardsModel);
module.exports = Cards;
