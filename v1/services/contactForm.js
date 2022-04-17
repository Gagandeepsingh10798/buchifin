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
const Create = async (createObj) => {
    try {
        let form = await Model.ContactForm(createObj).save()
        form = await Model.ContactForm.findById(form._id, PROJECTION.CREATE).lean().exec()
        return { status: codes.OK, message: messages.FORM_ADDED_SUCCESSFULLY, data: form }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Find = async (findObj) => {
    try {
        findObj.isDeleted = false
        let forms = await Model.ContactForm.find(findObj, PROJECTION.FIND).lean().exec()
        return { status: codes.OK, message: messages.FORMS_FETCHED_SUCCESSFULLY, data: forms }
    }
    catch (error) {
        throw new Error(error)
    }
}
const Update = async (id, updateObj) => {
    try {
        let form = await Model.ContactForm.findByIdAndUpdate(mongoose.Types.ObjectId(id), updateObj).lean().exec()
        form = await Model.ContactForm.findById(form._id, PROJECTION.CREATE).lean().exec();
        return { status: codes.OK, message: messages.FORM_UPDATED_SUCCESSFULLY, data: form }
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