const config = require('config');
const Model = require("../../models");
const universal = require('../../utils')
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages
const moment = require('moment')
let PROJECTION = {
    Find: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0 },
    FindDriver: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, password: 0 }
}
const Find = async (findObj) => {
    try {
        let actualEmail = findObj.actualEmail
        if (actualEmail) delete findObj.actualEmail
        let otp = await Model.Otp.findOne(findObj).lean().exec()
        if (otp) {
            findObj.isDeleted = false
            await Model.Otp.findByIdAndRemove(otp._id)
            delete findObj.code
            if (!actualEmail) {
                let driver = await Model.Driver.findOneAndUpdate(findObj, { isEmailVerify: true })
                driver = await Model.Driver.findOne(driver._id, PROJECTION.FindDriver).lean().exec()
                return { status: codes.OK, message: messages.OTP_VERIFIED_SUCCESSFULLY, data: driver }
            }
            else {
                return { status: codes.OK, message: messages.OTP_VERIFIED_SUCCESSFULLY, data: "" }
            }
        }
        else return { status: codes.BAD_REQUEST, message: messages.UNABLE_TO_VERIFY_OTP, data: "" }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Create = async (createObj) => {
    try {
        let OTP = await universal.generateOtp()
        let driver = createObj
        let query = {}
        if (driver.email) query.email = driver.email
        if (driver.phone) {
            query.phone = driver.phone
            query.countryCode = driver.countryCode
        }
        let otp = await Model.Otp.findOneAndDelete(query).lean().exec()
        otp = await Model.Otp({ email: driver.email, phone: driver.phone, countryCode: driver.countryCode, code: OTP, expireAt: moment().add(config.get('OTP_OPTIONS').EXPIRES, config.get('OTP_OPTIONS').IN) }).save()
        otp = await Model.Otp.findById(otp._id, PROJECTION.Find).lean().exec()
        return { status: codes.OK, message: messages.OTP_SENT_SUCCESSFULLY, data: otp }
    }
    catch (error) {
        throw new Error(error)
    }
}

const Update = async (createObj) => {
    try {
        const customer = await Customer.findOne({ email: createObj.userEmail, isDeleted: false });
        const otp = await Otp.findOne({ code: createObj.code });
        if (!customer) return { status: codes.BAD_REQUEST, message: messages.NO_ANY_CUSTOMER_FOUND, data: {} };
        if (otp.code !== createObj.code) return { status: codes.BAD_REQUEST, message: messages.UNABLE_TO_VERIFY_OTP };
        customer.email = createObj.email;
        customer.isEmailVerify = true;
        await customer.save();
        return { status: codes.OK, message: messages.PROFILE_UPDATED, data: customer };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    Find,
    Create,
    Update
}