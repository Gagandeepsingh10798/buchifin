const config = require("config");
const validations = require("../validations");
const universal = require("../../utils");
const MESSAGES = require("../../constants").Messages;
const CODES = require("../../constants").Codes;
const Models = require('../../models');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');
const Projections = {
  login: { "deviceToken": 0, "deviceType": 0, "createdAt": 0, "updatedAt": 0, "__v": 0 }
};
module.exports = {
  /*
  Request API
  */
  loginRequest: async (req, res, next) => {
    try {
      await validations.customer.validateLoginRequest(req,'body');
      const {phone, countryCode} = req.body;
      let customer = await Models.Customer.findOne({ phone, countryCode, isDeleted: false}).lean();
      if(!customer){
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.CUSTOMER_NOT_EXIST, {}, req.lang);
      }
      const isPasswordMatched = await universal.comparePasswordUsingBcrypt(req.body.password, customer.password);
      if(!isPasswordMatched){
        return await universal.response(resCODES.BAD_REQUEST, MESSAGES.PASSWORD_NOT_MATCH, {}, req.lang);
      }
      const OTP = {
        code: "0000",
        email: customer.email,
        phone: customer.phone,
        countryCode: customer.countryCode,
        type: "LOGIN",
        expireAt: moment().add(3, 'minutes')
      }
      const OTP_SENT = await Models.Otp.findOne({
        code: "0000",
        email: customer.email,
        phone: customer.phone,
        countryCode: customer.countryCode,
        type: "LOGIN",
      }).lean();
      if (OTP_SENT && (moment(OTP_SENT.expireAt) >= moment())) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.OTP_ALREADY_SENT, {}, req.lang);
      }
      await Models.Otp(OTP).save();
      return await universal.response(res, CODES.OK, MESSAGES.OTP_SENT_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      await validations.customer.validateLogin(req,'body');
      const {phone, countryCode, code} = req.body;
      const OTP = await Models.Otp.findOne({ phone, countryCode, code, type: "LOGIN" }).lean();
      if (!OTP) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.INCORRECT_OTP, {}, req.lang);
      }
      if (moment(OTP.expireAt) <= moment()) {
        await Models.Otp.findOneAndDelete({ _id: ObjectId(OTP._id) });
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.OTP_EXPIRED, {}, req.lang);
      }
      let customer = await Models.Customer.findOne({ phone, countryCode, isDeleted: false}, Projections.login).lean();
      if(!customer){
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.CUSTOMER_NOT_EXIST, {}, req.lang);
      }
      const isPasswordMatched = await universal.comparePasswordUsingBcrypt(req.body.password, customer.password);
      if(!isPasswordMatched){
        return await universal.response(resCODES.BAD_REQUEST, MESSAGES.PASSWORD_NOT_MATCH, {}, req.lang);
      }
      delete customer.password;
      customer.authToken = await universal.jwtSign({_id: customer._id});
      customer = {
        status: CODES.OK,
        message: MESSAGES.CUSTOMER_LOGGED_IN_SUCCESSFULLY,
        data: customer
      };
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
     
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
