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
    FIND: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0, category: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, slug: 0, image: 0, isBlocked: 0, description: 0 } }
}
const Create = async (createObj) => {
    try {
        if (createObj.category) createObj.category = mongoose.Types.ObjectId(createObj.category)
        let product = await Model.FuelProduct(createObj).save()
        product = await Model.FuelProduct.findById(product._id, PROJECTION.CREATE).lean().exec()
        return { status: codes.OK, message: messages.FUEL_PRODUCT_SAVED_SUCCESSFULLY, data: product }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Find = async (findObj) => {
    try {
        let query = { isDeleted: false }
        let sort = { createdAt: -1 }
        if (findObj.sort) {
            sort = {}
            sort[findObj.sort] = 1
        }
        if (findObj.category) query.category = mongoose.Types.ObjectId(findObj.category)
        if (findObj.capacity) query.capacity = Number(findObj.capacity)
        let products = await Model.FuelProduct.aggregate(
            [
                { $match: query },
                {
                    $lookup: {
                        from: "fuelcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $sort: sort
                },
                {
                    $project: PROJECTION.FIND
                }
            ]
        ).exec()
        const message = products.length > 0 ?  messages.FUEL_PRODUCTS_FETCHED_SUCCESSFULLY : messages.No_FUEL_PRODUCT_ADDED_BY_ADMIN
        return { status: codes.OK, message: message, data: products }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        let product = await Model.FuelProduct.findByIdAndUpdate(mongoose.Types.ObjectId(id), updateObj).lean().exec()
        product = await Model.FuelProduct.findById(product._id, PROJECTION.CREATE).lean().exec();
        return { status: codes.OK, message: messages.FUEL_PRODUCT_UPDATED_SUCCESSFULLY, data: product }
    }
    catch (error) {
        throw new Error(error)
    }
}
const UpdateMany = async (findObj, setObj) => {
    try {
        let products = await Model.FuelProduct.updateMany(findObj, { $set: setObj })
        return { status: codes.OK, message: messages.FUEL_PRODUCTS_UPDATED_SUCCESSFULLY, data: products }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Create,
    Find,
    Update,
    UpdateMany
}