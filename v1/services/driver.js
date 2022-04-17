const config = require('config');
const Model = require("../../models");
const universal = require('../../utils')
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const moment = require('moment')
const EmailService = require('../../utils').emailService
const mongoose = require('mongoose')
let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0, totalRatingsRecieved: 0, onBreak: 0, acceptedBooking: 0, cancelledBooking: 0, totalRatings: 0 },
    FINDWITHLIMIT: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0, totalRatingsRecieved: 0, long: 0, lat: 0, documents: 0, ifsc: 0, bankName: 0, accountNumber: 0, est: 0, sst: 0, isEmailVerify: 0, isPhoneVerify: 0 },
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0 },
}
const Create = async (createObj) => {
    try {
        createObj.password = await universal.hashPasswordUsingBcrypt(createObj.password)
        let isExist = await Model.Driver.find({ email: createObj.email, isDeleted: false }).lean().exec()
        if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        if (createObj.phone) {
            isExist = await Model.Driver.find({ phone: createObj.phone, countryCode: createObj.countryCode, isDeleted: false }).lean().exec()
            if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        }
        let driver = await Model.Driver(createObj).save()
        driver = await Model.Driver.findById(driver._id, PROJECTION.CREATE).lean().exec()
        driver.auth = await universal.jwtSign(driver)
        let OTP = await universal.generateOtp()
        await Model.Otp({ email: driver.email, phone: driver.phone, countryCode: driver.countryCode, code: OTP, expireAt: moment().add(config.get('OTP_OPTIONS').EXPIRES, config.get('OTP_OPTIONS').IN) }).save()
        EmailService.sendEmail(driver.email, config.get('EMAIL_SERVICE').SUBJECTS.DRIVER_REGISTRATION_OTP, OTP)
        return { status: codes.OK, message: messages.DRIVER_REGISTERED_SUCCESSFULLY, data: driver }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Find = async (findObj) => {
    try {
        let query = { isDeleted: false }
        if (findObj.email) query.email = findObj.email
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id)
        let driver = await Model.Driver.find(query, PROJECTION.CREATE).lean().exec()
        if (driver.length < 1) { return { status: codes.BAD_REQUEST, message: messages.NO_ANY_DRIVER_FOUND, data: driver } };
        return { status: codes.OK, message: messages.DRIVERS_FETCHED_SUCCESSFULLY, data: driver }
    }
    catch (error) {
        throw new Error(error)
    }
}
const FindWithLimit = async (findObj, skip) => {
    try {
        let query = { isDeleted: false }
        if (findObj.email) query.email = findObj.email
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id)
        let driver = await Model.Driver.find(query, PROJECTION.FINDWITHLIMIT).sort({ createdAt: -1 }).skip(skip).limit(10);
        let totalDrivers = await Model.Driver.find(query).countDocuments();
        return { status: codes.OK, message: messages.DRIVERS_FETCHED_SUCCESSFULLY, data: {pages: Math.ceil(totalDrivers / 10), driver } }
    }
    catch (error) {
        throw new Error(error)
    }
}
const FindWithPassword = async (findObj) => {
    try {
        let query = { isDeleted: false }
        if (findObj.email) query.email = findObj.email
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id)
        let driver = await Model.Driver.findOne(query, PROJECTION.FIND_WITH_PASSWORD).lean().exec()
        if (!driver) { return { status: codes.BAD_REQUEST, message: messages.NO_ANY_DRIVER_FOUND, data: driver } }
        return { status: codes.OK, message: messages.DRIVER_FETCHED_SUCCESSFULLY, data: driver }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        id = mongoose.Types.ObjectId(id)
        if (updateObj.phone) {
            let isExist = await Model.Driver.find({ _id: { $nin: [id] }, phone: updateObj.phone, countryCode: updateObj.countryCode, isDeleted: false }).lean().exec()
            if (isExist.length > 0) return { status: codes.BAD_REQUEST, message: messages.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} }
        }
        if (updateObj.email) {
            let isExist = await Model.Driver.find({ _id: { $nin: [id] }, email: updateObj.email, isDeleted: false }).lean().exec()
            if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        }
        if (updateObj.password) updateObj.password = await universal.hashPasswordUsingBcrypt(updateObj.password)
        let driver = await Model.Driver.findByIdAndUpdate(id, updateObj, { new: true })
        driver = await Model.Driver.findById(driver._id, PROJECTION.CREATE).lean().exec()
        if (updateObj.password) {
            return { status: codes.OK, message: messages.PASSWORD_RESET_SUCCESSFULLY, data: driver }
        }
        return { status: codes.OK, message: messages.DRIVER_UPDATED_SUCCESSFULLY, data: driver }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Create,
    Find,
    FindWithPassword,
    Update,
    FindWithLimit
}