const Model = require("../../models");
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const mongoose = require('mongoose')
let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0, isBlocked: 0 },
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 },
    FIND: { __v: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 }
}
const FindWithPagination = async(pipeline, page=1) => {
    try {
        let data = await Model.Vehicle.aggregate(pipeline).skip((page-1)*10).limit(10);
        const total = (await Model.Vehicle.aggregate(pipeline)).length;
        return {status: codes.OK, message: messages.VEHICLE_FETCHED_SUCCESSFULLY, data:{totalPages: Math.ceil(total/10), data} }
    } catch (error) {
        throw new Error(error);
    }
}
const Create = async (createObj) => {
    try {
        let category = await Model.Vehicle(createObj).save()
        category = await Model.Vehicle.findById(category._id, PROJECTION.CREATE).lean().exec()
        return { status: codes.OK, message: messages.FUEL_CATEGORY_SAVED_SUCCESSFULLY, data: category }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Find = async (findObj) => {
    try {
        findObj.isDeleted = false
        let categories = await Model.Vehicle.find(findObj, PROJECTION.FIND).lean().exec()
        return { status: codes.OK, message: messages.FUEL_CATEGORIES_FETCHED_SUCCESSFULLY, data: categories }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        let category = await Model.Vehicle.findByIdAndUpdate(mongoose.Types.ObjectId(id), updateObj).lean().exec()
        category = await Model.Vehicle.findById(category._id, PROJECTION.CREATE).lean().exec();
        return { status: codes.OK, message: messages.FUEL_CATEGORY_UPDATED_SUCCESSFULLY, data: category }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Create,
    Find,
    Update,
    FindWithPagination
}