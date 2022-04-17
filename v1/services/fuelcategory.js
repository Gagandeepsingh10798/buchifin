const config = require('config');
const Model = require("../../models");
const universal = require('../../utils')
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const moment = require('moment')
const EmailService = require('../../utils').emailService
const mongoose = require('mongoose')
let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0, isBlocked: 0 },
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 },
    FIND: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 }
}

const FindWithPaginationcategories = async(pipeline, page=1)=> {
    try {
        const data = await Model.FuelCategory.aggregate(pipeline).skip((page-1)*10).limit(10);
        let total = await Model.FuelCategory.find({isDeleted: false}).countDocuments();
        total = Math.ceil(total/10);
        return { status: codes.OK, message: messages.FUEL_CATEGORIES_FETCHED_SUCCESSFULLY, data: {data,total} }
    } catch (error) {
        throw new Error(error)
    }
}

const Create = async (createObj) => {
    try {
        let isExist = await Model.FuelCategory.findOne({ isDeleted: false, name: createObj.name }).lean()
        if (isExist) return { status: codes.BAD_REQUEST, message: messages.FUEL_CATEGORY_ALREADY_EXIST, data: "" }
        let category = await Model.FuelCategory(createObj).save()
        category = await Model.FuelCategory.findById(category._id, PROJECTION.CREATE).lean().exec()
        return { status: codes.OK, message: messages.FUEL_CATEGORY_SAVED_SUCCESSFULLY, data: category }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Find = async (findObj) => {
    try {
        findObj.isDeleted = false
        let categories = await Model.FuelCategory.find(findObj, PROJECTION.FIND).lean().exec()
        return { status: codes.OK, message: messages.FUEL_CATEGORIES_FETCHED_SUCCESSFULLY, data: categories }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        let category = await Model.FuelCategory.findByIdAndUpdate(mongoose.Types.ObjectId(id), updateObj).lean().exec()
        category = await Model.FuelCategory.findById(category._id, PROJECTION.CREATE).lean().exec();
        return { status: codes.OK, message: messages.FUEL_CATEGORY_UPDATED_SUCCESSFULLY, data: category }
    }
    catch (error) {
        throw new Error(error)
    }
}
const FindWithPagination = async (findObj, page) => {
    try {
        findObj.isDeleted = false
        let categories = await Model.FuelCategory.find(findObj, PROJECTION.FIND).sort({createdAt: -1}).skip(page).limit(10).lean().exec()
        let totalCategories =await Model.FuelCategory.find(findObj).countDocuments();
        return { status: codes.OK, message: messages.FUEL_CATEGORIES_FETCHED_SUCCESSFULLY, data: {pages: Math.ceil(totalCategories/10),categories} }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    FindWithPagination,
    Create,
    Find,
    Update,
    FindWithPaginationcategories
}