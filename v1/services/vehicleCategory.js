const Model = require("../../models");
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const mongoose = require('mongoose')
let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0, isBlocked: 0 },
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 },
    FIND: { __v: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 }
}
const Create = async (createObj) => {
    try {
        let category = await Model.VehicleCategory(createObj).save()
        category = await Model.VehicleCategory.findById(category._id, PROJECTION.CREATE).lean().exec()
        return { status: codes.OK, message: messages.FUEL_CATEGORY_SAVED_SUCCESSFULLY, data: category }
    }
    catch (error) {
        throw new Error(error)
    }
};

const FindWithPagination = async(pipeline, page=1) => {
    try {
        page = Number(page);
        console.log({page});
        let data = await Model.VehicleCategory.aggregate(pipeline);
        const total = (await Model.VehicleCategory.aggregate(pipeline)).length;
        return {status: codes.OK, message: messages.VEHICLE_CATEGORY_FETCHED, data:{totalPages: Math.ceil(total/10), data} }
    } catch (error) {
        throw new Error(error);
    }
}
const Find = async (findObj) => {
    try {
        findObj.isDeleted = false
        let categories = await Model.VehicleCategory.find(findObj, {
            isDeleted: 1, capacity: 1, createdAt: 1, updatedAt: 1
        }).lean().exec()
        if (categories.length == 0) return {status: codes.BAD_REQUEST, message: messages.NOT_FOUND, data: {}}
        return { status: codes.OK, message: messages.VEHICLE_CATEGORY_FETCHED, data: categories }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        let category = await Model.VehicleCategory.findByIdAndUpdate(mongoose.Types.ObjectId(id), updateObj).lean().exec()
        category = await Model.VehicleCategory.findById(category._id, PROJECTION.CREATE).lean().exec();
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