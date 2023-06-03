const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Schema = mongoose.Schema;
const FirmDetailsModel = new Schema({
    retailer:{
        type: ObjectId,
        ref:'User'
    },
    firmName: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    licenses: {
        insecticide: {
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        },
        fertilizer: {
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        },
        seed: {
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        },
        others: [{
            name: {
                type: String
            },
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        }]
    },
    gst: {
        number: {
            type: Number
        },
        document: {
            type: String,
            default: ''
        }
    },
    firmType: {
        type: String,
        enum: ['PROPRIETORSHIP', 'PARTNERSHIP', 'PVTLIMITED', 'OTHER']
    },
    partners: [
        {
            Type: ObjectId
        }
    ],
    documents:{
        govcertificate: {
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        },
        other: [{
            name:{
                type: String
            },
            number: {
                type: Number
            },
            document: {
                type: String,
                default: ''
            }
        }]
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED', 'REJECTED'],
        default: 'ACTIVE'
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
const FirmDetails = mongoose.model('FirmDetails', FirmDetailsModel);
module.exports = FirmDetails;