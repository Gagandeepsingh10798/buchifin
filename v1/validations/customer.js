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
    validateLoginRequest: async (req, property) => {
        let schema = joi.object().keys({
            phone: joi.string().regex(/^[0-9]+$/).min(5).required(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).required(),
            password: joi.string().required()
        });
        return await validateSchema(req[property], schema);
    },
    validateLogin: async (req, property) => {
        let schema = joi.object().keys({
            phone: joi.string().regex(/^[0-9]+$/).min(5).required(),
            countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).required(),
            password: joi.string().required(),
            code: joi.string().required(),
            deviceType: joi.string().optional(),
            deviceToken: joi.string().optional()
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
                const userData = await Model.Customer.findOne({ _id: decodeData._id, idDeleted: false }).lean().exec();
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
    }
}

