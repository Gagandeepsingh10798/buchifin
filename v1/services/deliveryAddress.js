const Model = require("../../models");
const mongoose = require("mongoose");
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0 },
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0 },
    FIND: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, customerId: 0 }
}
const Create = async (createObj) => {
    try {
        let address = await Model.Address(createObj).save()
        address = await Model.Address.findById(address._id, PROJECTION.CREATE).lean().exec();
        return { status: codes.OK, message: messages.DELIVERY_ADDRESS_SAVED_SUCCESSFULLY, data: address }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Find = async (findObj) => {
    try {
        findObj.isDeleted = false
        let addresses = await Model.Address.find(findObj, PROJECTION.FIND).lean().exec();
        return { status: codes.OK, message: messages.DELIVERY_ADDRESSES_FETCHED_SUCCESSFULLY, data: addresses }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        let address = await Model.Address.findByIdAndUpdate(mongoose.Types.ObjectId(id), updateObj).lean().exec()
        address = await Model.Address.findById(address._id, PROJECTION.CREATE).lean().exec();
        return { status: codes.OK, message: messages.DELIVERY_ADDRESSES_UPDATED_SUCCESSFULLY, data: address }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Create,
    Find,
    Update
}