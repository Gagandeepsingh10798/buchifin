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
        const userData = await Model.Admin.findOne({ _id: decodeData._id }).lean().exec();
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
      profilePic: joi.string().trim().lowercase().required(),
      password: joi.string().required(),
      deviceType: joi.string().optional(),
      deviceToken: joi.string().optional(),
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
  validateNewPassword: async (req, property) => {
    let schema = joi.object().keys({
      password: joi.string().required(),
    });
    return await validateSchema(req[property], schema);
  },
  validateNewPassword: async (req, property) => {
    let schema = joi.object().keys({
      password: joi.string().required(),
      otp: joi.number().required(),
    });
    return await validateSchema(req[property], schema);
  },

  validateAddFuelCategory: async (req, property) => {
    let schema = joi.object().keys({
      name: joi.string().trim().lowercase().required(),
      slug: joi.string().trim().lowercase().required(),
      description: joi.string().trim().required(),
      image: joi.string().trim().required(),
    });
    return await validateSchema(req[property], schema);
  },
  validateUpdateFuelCategory: async (req, property) => {
    let schema = joi.object().keys({
      name: joi.string().trim().lowercase().optional(),
      slug: joi.string().trim().lowercase().optional(),
      description: joi.string().trim().optional(),
      image: joi.string().trim().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  validateAddFuelProduct: async (req, property) => {
    let schema = joi.object().keys({
      price: joi.number().required(),
      category: joi.string().length(24).trim().required(),
      capacity: joi.number().required(),
      dimension: joi.number().required(),
      type: joi.string().trim().optional(),
      location: joi.string().trim().required(),
      lat: joi.number().optional(),
      long: joi.number().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  validateUpdateBooking: (req, property) => {
    let schema = joi.object({
      driverId: joi.string().length(24).optional(),
      bookingId: joi.string().length(24).optional(),
    });
    return validateSchema(req[property], schema);
  },

  validateUpdateUser: async (req, property) => {
    let schema = joi.object({
      name: joi.string().optional(),
      email: joi.string().optional(),
      phone: joi.string().optional(),
      address: joi.string().optional(),
      password: joi.string().optional(),
      confirmPassword: joi.string().valid(joi.ref("password")).required(),
    });
    return await validateSchema(req[property], schema);
  },
  promoValidation: async (req, property) => {
    let schema = joi.object({
      promo: joi.string().required().min(4),
      discount: joi.number().required(),
      validUpto: joi.date().required(),
    });
    return await validateSchema(req[property], schema);
  },
  customerBookingValidation: async (req, property) => {
    let schema = joi.object({
      page: joi.number().optional(),
      customerId: joi.string().required().length(24),
      search: joi.string().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  addDriverValidation: async (req, property) => {
    let schema = joi.object({
      firstName: joi.string().required(),
      lastName: joi.string().optional(),
      email: joi.string().required().email(),
      password: joi.string().required().min(6),
      address: joi.string().required(),
      phone: joi.string().required(),
      countryCode: joi.string().required(),
      lat: joi.number().optional(),
      long: joi.number().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  updateDriverValidation: async (req, property) => {
    let schema = joi.object({
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
      email: joi.string().optional().email(),
      password: joi.string().optional().min(6),
      address: joi.string().optional(),
      phone: joi.string().optional(),
      countryCode: joi.string().optional(),
      lat: joi.number().optional(),
      long: joi.number().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  addCustomerValidation: async (req, property) => {
    let schema = joi.object({
      firstName: joi.string().required(),
      lastName: joi.string().optional(),
      email: joi.string().required().email(),
      password: joi.string().required().min(6),
      address: joi.string().required(),
      phone: joi.string().required(),
      lat: joi.string().required(),
      long: joi.string().required(),
      countryCode: joi.string().required(),
    });
    return await validateSchema(req[property], schema);
  },
  updteSlotValidation: (data) => {
    let schema = joi.object({
      st: joi.string().optional().max(5),
      et: joi.string().optional().max(5),
      isClosed: joi.boolean().optional(),
    });

    return validateSchema(data, schema);
  },
  addVehicleValidation: async (req, property) => {
    let schema = joi.object({
      dimension: joi.object().keys({
        height: joi.number().required(),
        width: joi.number().required(),
      }),
      capacity: joi.number().required(),
      category: joi.string().required(),
    });
    return await validateSchema(req[property], schema);
  },
  updateVehicleValidation: async (req, property) => {
    let schema = joi.object({
      dimension: joi.object().keys({
        height: joi.number().optional(),
        width: joi.number().optional(),
      }),
      capacity: joi.number().optional(),
      category: joi.string().optional(),
    });
    return await validateSchema(req[property], schema);
  },
  vechileCategoryValidation: async (req, property) => {
    let schema = joi.object({
      capacity: joi.number().required(),
    });
    return await validateSchema(req[property], schema);
  },
  updateprofileValidation: async (data) => {
    let schema = joi.object({
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
      email: joi.string().optional(),
      phone: joi.number().optional(),
      countryCode: joi.string().optional(),
      url: joi.string().optional(),
      profilePic: joi.optional(),
    });
    return await validateSchema(data, schema);
  },
};
