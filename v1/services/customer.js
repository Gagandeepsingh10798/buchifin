const config = require('config');
const Model = require("../../models");
const universal = require('../../utils')
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const moment = require('moment')
const EmailService = require('../../utils').emailService
const mongoose = require('mongoose')
let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0, walletBalance: 0 },
    FIND_WITH_PASSWORD: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, walletBalance: 0 }
}
const Create = async (createObj) => {
    try {
        createObj.password = await universal.hashPasswordUsingBcrypt(createObj.password)
        let isExist = await Model.Customer.find({ email: createObj.email, isDeleted: false }).lean().exec()
        if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        isExist = await Model.Customer.find({ phone: createObj.phone, countryCode: createObj.countryCode, isDeleted: false }).lean().exec()
        if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        let customer = await Model.Customer(createObj).save();
        customer = await Model.Customer.findById(customer._id, PROJECTION.CREATE).lean().exec()
        customer.auth = await universal.jwtSign(customer)
        let OTP = await universal.generateOtp()
        await Model.Otp({ email: customer.email, phone: customer.phone, countryCode: customer.countryCode, code: OTP, expireAt: moment().add(config.get('OTP_OPTIONS').EXPIRES, config.get('OTP_OPTIONS').IN) }).save()
        EmailService.sendEmail(customer.email, config.get('EMAIL_SERVICE').SUBJECTS.CUSTOMER_REGISTRATION_OTP, OTP)
        return { status: codes.OK, message: messages.CUSTOMER_REGISTERED_SUCCESSFULLY, data: customer }
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
        let customers = await Model.Customer.find(query, PROJECTION.CREATE).sort({ createdAt: -1 }).skip(skip).limit(10).lean().exec();
        let totalCustomers = await Model.Customer.find(query).countDocuments();
        return { status: codes.OK, message: messages.CUSTOMERS_FETCHED_SUCCESSFULLY, data: { customers: customers, totalPages: Math.ceil(totalCustomers / 10) } }
    }
    catch (error) {
        throw new Error(error)
    }
}

const Find = async (findObj, projection = null) => {
    try {
        let query = { isDeleted: false }
        if (findObj.email) query.email = findObj.email
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id)
        let customer = await Model.Customer.find(query, projection ? projection : PROJECTION.CREATE).lean().exec()
        if (customer.length < 1) { return { status: codes.BAD_REQUEST, message: messages.NO_ANY_CUSTOMER_FOUND, data: customer } }
        return { status: codes.OK, message: messages.CUSTOMERS_FETCHED_SUCCESSFULLY, data: customer }
    }
    catch (error) {
        throw new Error(error)
    }
}
const FindWithPassword = async (findObj) => {
    try {
        let query = {  }
        if (findObj.email) query.email = findObj.email
        if (findObj._id) query._id = mongoose.Types.ObjectId(findObj._id)
        let customer = await Model.Customer.findOne(query, PROJECTION.FIND_WITH_PASSWORD).lean().exec()
        if (!customer) { return { status: codes.BAD_REQUEST, message: messages.NO_ANY_CUSTOMER_FOUND, data: customer } }
        return { status: codes.OK, message: messages.CUSTOMER_FETCHED_SUCCESSFULLY, data: customer }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        id = mongoose.Types.ObjectId(id)
        if (updateObj.password) updateObj.password = await universal.hashPasswordUsingBcrypt(updateObj.password)
        if (updateObj.email) {
            let isExist = await Model.Customer.find({ _id: { $nin: [id] }, email: updateObj.email, isDeleted: false }).lean().exec()
            if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        }
        if (updateObj.phone) {
            isExist = await Model.Customer.find({ _id: { $nin: [id] }, phone: updateObj.phone, countryCode: updateObj.countryCode, isDeleted: false }).lean().exec()
            if (isExist.length > 0) { return { status: codes.BAD_REQUEST, message: messages.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, data: {} } }
        }
        let customer = await Model.Customer.findByIdAndUpdate(id, updateObj, { new: true })
        customer = await Model.Customer.findById(customer._id, PROJECTION.CREATE).lean().exec()
        if (updateObj.password) {
            return { status: codes.OK, message: messages.PASSWORD_RESET_SUCCESSFULLY, data: customer }
        }
        return { status: codes.OK, message: messages.CUSTOMER_UPDATED_SUCCESSFULLY, data: customer }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Create,
    Find,
    FindWithPassword,
    FindWithLimit,
    Update
}