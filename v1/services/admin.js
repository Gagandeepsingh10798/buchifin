const config = require('config');
const Model = require("../../models");
const universal = require('../../utils')
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const moment = require('moment')
const EmailService = require('../../utils').emailService
const mongoose = require('mongoose')
let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0 },
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0 }
}

const FindWithLimit = async (findObj, page) => {
    try {
        let query = { isDeleted: false }
        if (findObj.email) query.email = findObj.email
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id)
        let driver = await Model.Driver.find(query, PROJECTION.CREATE).skip(page).limit(15);
        let totalDrivers = await Model.Driver.find().countDocuments().lean().exec();
        if (driver.length < 1) { return { status: codes.BAD_REQUEST, message: messages.NO_ANY_DRIVER_FOUND, data: driver } };
        return { status: codes.OK, message: messages.DRIVERS_FETCHED_SUCCESSFULLY, data: { driver, totalDrivers } }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Create = async (createObj) => {
    try {
        createObj.password = await universal.hashPasswordUsingBcrypt(createObj.password)
        let isExist = await Model.Admin.find({ email: createObj.email }).lean().exec()
        if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        isExist = await Model.Admin.find({ phone: createObj.phone, countryCode: createObj.countryCode }).lean().exec()
        if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        let admin = await Model.Admin(createObj).save()
        admin = await Model.Admin.findById(admin._id, PROJECTION.CREATE).lean().exec()
        admin.auth = await universal.jwtSign(admin)
        return { status: codes.OK, message: messages.ADMIN_REGISTERED_SUCCESSFULLY, data: admin }
    }
    catch (error) {
        throw new Error(error)
    }
}

const Logout = async (id, updateObj) => {
    try {
        await Model.Admin.findByIdAndUpdate(id, updateObj)
        return { status: codes.OK, message: messages.ADMIN_LOGOUT_SUCCESSFULLY }
    } catch (error) {
        throw new Error(error)
    }
}

const Find = async (body) => {
    try {
        if (body.email) {
            const admin = await Model.Admin.findOne({ email: body.email }, PROJECTION.FIND_WITH_PASSWORD).lean().exec();
            if (!admin) return { status: codes.BAD_REQUEST, message: messages.ADMIN_NOT_EXIST, data: {} };
            admin.auth = await universal.jwtSign(admin);
            return { status: codes.OK, message: messages.ADMIN_LOGIN_SUCCESS_MSG, data: admin };
        }
        if (body._id) {
            const admin = await Model.Admin.findById(body._id, PROJECTION.CREATE).lean().exec();
            return { status: codes.OK, message: messages.ADMIN_FETCH_SUCCESSFULLY, data: admin };
        }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj, flag = false) => {
    try {
        id = mongoose.Types.ObjectId(id)
        if (updateObj.password && !flag) {
            let isExist = await Model.Admin.findById(id).lean().exec()
            const isMatch = await universal.comparePasswordUsingBcrypt(updateObj.oldPassword, isExist.password)
            if (isMatch) {
                delete updateObj.oldPassword
                updateObj.password = await universal.hashPasswordUsingBcrypt(updateObj.password)
                let admin = await Model.Admin.findByIdAndUpdate(id, updateObj, { new: true })
                return { status: codes.OK, message: messages.ADMIN_UPDATED_SUCCESSFULLY, data: admin }
            } else {
                return { status: codes.BAD_REQUEST, message: messages.PASSWORD_NOT_MATCH, data: {} }
            }
        }
        if (updateObj.password && flag) {
            updateObj.password = await universal.hashPasswordUsingBcrypt(updateObj.password)
            let admin = await Model.Admin.findByIdAndUpdate(id, updateObj, { new: true })
            return { status: codes.OK, message: messages.PASSWORD_CHANGE_SUCCESSFULLY, data: admin }
        }
        if (updateObj.email) {
            let isExist = await Model.Admin.find({ _id: { $nin: [id] }, email: updateObj.email, isDeleted: false }).lean().exec()
            if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        }
        if (updateObj.phone) {
            isExist = await Model.Admin.find({ _id: { $nin: [id] }, phone: updateObj.phone, countryCode: updateObj.countryCode, isDeleted: false }).lean().exec()
            if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        }
        let admin = await Model.Admin.findByIdAndUpdate(id, updateObj, { new: true })
        admin = await Model.Admin.findById(admin._id, PROJECTION.CREATE).lean().exec()
        return { status: codes.OK, message: messages.ADMIN_UPDATED_SUCCESSFULLY, data: admin }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Create,
    Find,
    Update,
    FindWithLimit,
    Logout
}