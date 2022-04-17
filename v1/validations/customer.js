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
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required(),
            phone: joi.string().regex(/^[0-9]+$/).min(5).required(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).required(),
            password: joi.string().required(),
            deviceType: joi.string().optional(),
            deviceToken: joi.string().optional()
        });
        return await validateSchema(req[property], schema);
    },
    validateEditProfile: async (req, property) => {
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().optional(),
            phone: joi.string().regex(/^[0-9]+$/).min(5).optional(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional(),
            firstName: joi.string().optional(),
            lastName: joi.string().optional(),
            profilePic: joi.string().optional(),
            address: joi.string().optional(),
            lat: joi.string().optional(),
            long: joi.string().optional(),
        });
        return await validateSchema(req[property], schema);
    },
    validatelogin: async (req, property) => {
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required(),
            password: joi.string().required(),
            deviceType: joi.string().optional(),
            deviceToken: joi.string().optional()
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
    isCustomerValid: async (req, res, next) => {
        try {
            if (req.user && req.user.guestMode) {
                next();
            } else if (req.headers.auth) {
                const accessToken = req.headers.auth;
                const decodeData = await universal.jwtVerify(accessToken);
                if (!decodeData) throw new Error("Invalid Auth");
                const userData = await Model.Customer.findOne({ _id: decodeData._id }).lean().exec();
                if (userData) {
                    req.user = userData;
                    next();
                } else {
                    return universal.response(res, Codes.BAD_REQUEST, Messages.CUSTOMER_NOT_EXIST, "", req.lang);
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
            profilePic: joi.string().optional(),
            address: joi.string().required(),
            lat: joi.string().optional(),
            long: joi.string().optional(),
            deliveryAddresses: joi.array().items(joi.object().keys({
                country: joi.string().required(),
                location: joi.string().required(),
                lat: joi.string().optional(),
                long: joi.string().optional(),
                consignee: joi.string().required(),
                phone: joi.string().regex(/^[0-9]+$/).min(5).required(),
                countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).required(),
            })).optional()
        });
        return await validateSchema(req[property], schema);
    },
    validateResendOtp: async (req, property) => {
        let schema = joi.object().keys({
            email: joi.string().trim().lowercase().required()
        });
        return await validateSchema(req[property], schema);
    },
    validateaddCard: async (req, property) => {
        const schema = joi.object({
            fullName: joi.string().required(),
            cardNumber: joi.string().required().length(16),
            expireDate: joi.string().required(),
            cardId: joi.string().optional()
        });
        return await validateSchema(req[property], schema);
    },
    validateUpdateCard: async (req, property) => {
        const schema = joi.object({
            fullName: joi.string().required(),
            cardNumber: joi.string().required().length(16),
            expireDate: joi.string().required(),
            id: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
    validateAddDeliveryAddresses: async (req, property) => {
        const schema = joi.object({
            country: joi.string().required(),
            location: joi.string().required(),
            lat: joi.string().optional(),
            long: joi.string().optional(),
            consignee: joi.string().required(),
            phone: joi.string().regex(/^[0-9]+$/).min(5).required(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).required()
        });
        return await validateSchema(req[property], schema);
    },
    validateUpdateAddress: async (req, property) => {
        const schema = joi.object({
            country: joi.string().optional(),
            location: joi.string().optional(),
            lat: joi.string().optional(),
            long: joi.string().optional(),
            consignee: joi.string().optional(),
            phone: joi.string().regex(/^[0-9]+$/).min(5).optional(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional()
        });
        return await validateSchema(req[property], schema);
    },
    validateContactUs: async (req, property) => {
        const schema = joi.object({
            email: joi.string().trim().lowercase().required(),
            name: joi.string().required(),
            message: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
    validateCreateBooking: async (req, property) => {
        const schema = joi.object({
            product: joi.string().length(24).required(),
            bookingType: joi.string().optional().uppercase(),
            deliveryAddress: joi.string().length(24).required(),
            deliveryTime: joi.string().required(),
            deliveryDistance: joi.string().required(),
            date: joi.string().required(),
            paymentType: joi.string().required().valid("CASH", "CARD", "WALLET"),
            sheduledDate: joi.date().optional(),
            promo: joi.string().optional()
        });
        return await validateSchema(req[property], schema);
    },
    
    validateAddReview: async(req, property) => {
        const schema = joi.object({
            bookingId: joi.string().length(24).required(),
            driverId:joi.string().length(24).required(),
            comment: joi.string().optional().min(10),
            rating: joi.number().integer().required().max(5).min(1)
        });
        return await validateSchema(req[property], schema);
    },
    getBookingDetailValidation: async(req, property) => {
        const schema = joi.object({
            bookingId: joi.string().required().length(24)
        });
        return await validateSchema(req[property], schema);
    },
    addMoneyValidate: async(req, property) => {
        const schema = joi.object({
            amount: joi.number().required()
        });
        return await validateSchema(req[property], schema);
    }
}

