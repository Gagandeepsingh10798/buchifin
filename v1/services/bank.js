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
    FIND: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0 }
}
const FindAll = async () => {
    try {
        let banks = await Model.Bank.find({}, PROJECTION.FIND).lean().exec()
        return { status: codes.OK, message: messages.BANKS_FETCHED_SUCCESSFULLY, data: banks }
    }
    catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    FindAll
}