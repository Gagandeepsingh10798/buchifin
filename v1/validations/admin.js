const joi = require("joi");
const universal = require("../../utils");
const Model = require("../../models");
const Codes = require("../../constants").Codes;
const Messages = require("../../constants").Messages;
const validateSchema = async (inputs, schema) => {
  try {
    let { error, _ } = schema.validate(inputs);
    if (error) throw error.details ? error.details[0].message.replace(/['"]+/g, "") : "";
    else return false;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  isAdminValid: async (req, res, next) => {
    try {
      if (req.user && req.user.guestMode) {
        next();
      } else if (req.headers.authorization) {
        const accessToken = req.headers.authorization;
        const decodeData = await universal.jwtVerify(accessToken);
        if (!decodeData) throw new Error("Invalid Auth");
        const userData = await Model.User.findOne({ _id: decodeData._id, isDeleted: false, type: "ADMIN" }).lean().exec();
        if (userData) {
          req.user = userData;
          next();
        } else {
          return universal.response(res, Codes.BAD_REQUEST, Messages.ADMIN_NOT_EXIST, "", req.lang);
        }
      } else {
        throw new Error("No Auth");
      }
    } catch (error) {
      next(error);
    }
  },
  validateSignUp: async (req, property) => {
    let schema = joi.object().keys({
      address: joi.object({
        lat: joi.string().default(''),
        lng: joi.string().default(''),
        street: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        country: joi.string().required(),
        zip: joi.string().required()
      }).required(),
      dob: joi.date(),
      lat: joi.string().default(''),
      lng: joi.string().default(''),
      gender: joi.string().valid('MALE', 'FEMALE'),
      firstName: joi.string().trim().required(),
      lastName: joi.string().trim().required(),
      email: joi.string().trim().lowercase().required(),
      phone: joi
        .string()
        .regex(/^[0-9]+$/)
        .min(5)
        .required(),
      countryCode: joi
        .string()
        .regex(/^[0-9,+]+$/)
        .trim()
        .min(2)
        .required(),
      // profilePic: joi.string().trim().lowercase().required(),
      password: joi.string().required(),
      deviceType: joi.string().optional(),
      deviceToken: joi.string().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  validateUpdateProfile: async (req, property) => {
    let schema = joi.object().keys({
      gender: joi.string().valid('MALE', 'FEMALE').optional(),
      dob: joi.date().optional(),
      address: joi.object({
        lat: joi.string().optional(''),
        lng: joi.string().optional(''),
        street: joi.string().optional(),
        city: joi.string().optional(),
        state: joi.string().optional(),
        country: joi.string().optional(),
        zip: joi.string().optional()
      }).optional(),
      firstName: joi.string().trim().optional(),
      lastName: joi.string().trim().optional(),
      email: joi.string().trim().lowercase().optional(),
      phone: joi
        .string()
        .regex(/^[0-9]+$/)
        .min(5)
        .optional(),
      countryCode: joi
        .string()
        .regex(/^[0-9,+]+$/)
        .trim()
        .min(2)
        .optional()
    });
    return await validateSchema(req[property], schema);
  },

  validateLogin: async (req, property) => {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    return await validateSchema(req[property], schema);
  },
  validateChangePassword: async (req, property) => {
    let schema = joi.object().keys({
      oldPassword: joi.string().required(),
      newPassword: joi.string().required(),
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
      email: joi.string().trim().lowercase().required(),
      code: joi.string().required(),
      password: joi.string().required(),
    });
    return await validateSchema(req[property], schema);
  },
  /*
  Manage Apps
  */
  validateCreateApp: async (req, property) => {
    let schema = joi.object().keys({
      name: joi.string().required(),
      icon: joi.string().required(),
    });
    return await validateSchema(req[property], schema);
  },
  validateGetApp: async (req, property) => {
    let schema = joi.object().keys({
      id: joi.string().required()
    });
    return await validateSchema(req[property], schema);
  },
  validateUpdateApp: async (req, property) => {
    let schema = joi.object().keys({
      name: joi.string().optional(),
      icon: joi.string().optional(),
      status: joi.string().valid('ACTIVE', 'BLOCKED').optional(),
      isDeleted: joi.bool().optional()
    });
    return await validateSchema(req[property], schema);
  },
  /*
  Manage News
  */
  validateCreateNews: async (req, property) => {
    let schema = joi.object().keys({
      heading: joi.string().required(),
      subHeading: joi.string().optional(),
      icon: joi.string().required(),
      body: joi.string().required(),
    });
    return await validateSchema(req[property], schema);
  },
  /*
  Manage Customers
  */
  validateCreateUser: async (req, property) => {
    let schema = joi.object().keys({
      address: joi.string().trim().optional(),
      firstName: joi.string().trim().required(),
      lastName: joi.string().trim().required(),
      email: joi.string().trim().lowercase().required(),
      phone: joi
        .string()
        .regex(/^[0-9]+$/)
        .min(5)
        .required(),
      countryCode: joi
        .string()
        .regex(/^[0-9,+]+$/)
        .trim()
        .min(2)
        .required(),
      profilePic: joi.string().trim().lowercase().optional(),
      password: joi.string().required(),
      deviceType: joi.string().optional(),
      deviceToken: joi.string().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  /*
  Manage Users App
  */
  validateLinkApp: async (req, property) => {
    let schema = joi.object().keys({
      customer: joi.string().trim().optional(),
      app: joi.string().trim().required(),
      username: joi.string().trim().required()
    });
    return await validateSchema(req[property], schema);
  },
};
