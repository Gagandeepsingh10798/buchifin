const joi = require('joi');
const universal = require('../../utils')
const Model = require('../../models')
const Codes = require('../../constants').Codes
const Messages = require('../../constants').Messages
const validateSchema = async (inputs, schema) => {
    try {
        let { error, value } = schema.validate(inputs);
        if (error) throw error.details ? error.details[0].message.replace(/['"]+/g, '') : "";
        else return false;
    } catch (error) {
        throw error;
    }
};
module.exports = {
    validateSignUp: async (req, property) => {
        const { password } = req[property];
        const whitespace = " ";
        if ((password[0] === whitespace) || (password[password.length - 1] === whitespace)) throw Error("whitespace must be between password, not at starting or last !");
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required(),
            password: joi.string().required().min(6),
            deviceType: joi.string().required(),
            deviceToken: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
    validatelogin: async (req, property) => {
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required(),
            password: joi.string().required(),
            deviceType: joi.string().required(),
            deviceToken: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
    validateVerifyEmail: async (req, property) => {
        let schema = joi.object().keys({
            code: joi.string().length(4).required()
        });
        return await validateSchema(req[property], schema);
    },
    validateVerifyOtp: async (req, property) => {
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required(),
            code: joi.string().length(4).required()
        });
        return await validateSchema(req[property], schema);
    },
    validateForgotPassword: async (req, property) => {
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required(),
        });
        return await validateSchema(req[property], schema);
    },
    validateResetPassword: async (req, property) => {
        let schema = joi.object().keys({
            password: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
    validateChangePassword: async (req, property) => {
        let schema = joi.object().keys({
            oldPassword: joi.string().required(),
            newPassword: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
    isDriverValid: async (req, res, next) => {
        try {
            if (req.user && req.user.guestMode) {
                next();
            } else if (req.headers.auth) {
                const accessToken = req.headers.auth;
                const decodeData = await universal.jwtVerify(accessToken);
                if (!decodeData) throw new Error("Invalid Auth");
                const userData = await Model.Driver.findOne({ _id: decodeData._id }).lean().exec();
                if (userData) {
                    req.user = userData;
                    next();
                } else {
                    return universal.response(res, Codes.BAD_REQUEST, Messages.DRIVER_NOT_EXIST, "", req.lang);
                }
            } else {
                throw new Error("No Auth");
            }
        } catch (error) {
            next(error)
        }
    },
    validateCompleteProfile: async (req, property) => {
        let schema = joi.object().keys({
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            profilePic: joi.string().required(),
            address: joi.string().required(),
            lat: joi.string().required(),
            long: joi.string().required(),
            phone: joi.string().regex(/^[0-9]+$/).min(5).required(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).required(),
        });
        return await validateSchema(req[property], schema);
    },
    validateUploadDocuments: async (req, property) => {
        let schema = joi.object().keys({
            residentalAddress: joi.string().trim().required(),
            lat: joi.string().required(),
            long: joi.string().required(),
            accountNumber: joi.string().trim().required(),
            bankName: joi.string().trim().required(),
            accountType: joi.string().required(),
            accountName: joi.string().required(),
            bio: joi.string().trim().optional().allow(''),
            documents: joi.array().required(),
        });
        return await validateSchema(req[property], schema);
    },
    validateResendOtp: async (req, property) => {
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required()
        });
        return await validateSchema(req[property], schema);
    },
    validateEditProfile: async (req, property) => {
        let schema = joi.object().keys({
            onBreak: joi.boolean().optional(),
            firstName: joi.string().optional(),
            lastName: joi.string().optional(),
            profilePic: joi.string().optional(),
            address: joi.string().optional(),
            lat: joi.string().optional(),
            long: joi.string().optional(),
            email: joi.string().trim().lowercase().optional(),
            sst: joi.string().optional(),
            est: joi.string().optional(),
            phone: joi.string().regex(/^[0-9]+$/).min(5).optional(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional(),
        });
        return await validateSchema(req[property], schema);
    },
    validateBooking: async (req, property) => {
        const schema = joi.object({
            id: joi.string().length(24).required()
        });
        return await validateSchema(req[property], schema);
    },
    validateUpdateBooking : (req, property) => {
        let schema = joi.object({
            driverId: joi.string().length(24).optional(),
            bookingId: joi.string().length(24).optional()
        });
        return validateSchema(req[property], schema);
    },
    validateContactUs: async (req, property) => {
        const schema = joi.object({
            email: joi.string().trim().lowercase().required(),
            name: joi.string().required(),
            message: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
}

