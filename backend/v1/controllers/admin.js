const config = require("config");
const validations = require("../validations");
const universal = require("../../utils");
const MESSAGES = require("../../constants").Messages;
const CODES = require("../../constants").Codes;
const Models = require('../../models');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');
const Projections = {
  signUp: { "password": 0, "deviceToken": 0, "deviceType": 0, "createdAt": 0, "updatedAt": 0, "__v": 0, "type": 0, "status": 0, "isDeleted": 0 },
  login: { "deviceToken": 0, "deviceType": 0, "createdAt": 0, "updatedAt": 0, "__v": 0, "isDeleted": 0, "type": 0 },
  getProfile: { "password": 0, "deviceToken": 0, "deviceType": 0, "createdAt": 0, "updatedAt": 0, "__v": 0 , "isDeleted": 0,"type": 0 },
  updateProfile: { "password": 0, "deviceToken": 0, "deviceType": 0, "createdAt": 0, "updatedAt": 0, "isDeleted": 0,"__v": 0 , "type": 0},
  createApp: { "__v": 0 },
  getApps: { "__v": 0 },
  getApp:{ "__v": 0 },
  updateApp: { "__v": 0 },
  createNews: { "__v": 0 },
  getNews: { "__v": 0 },
  createUser: { "password": 0, "deviceToken": 0, "deviceType": 0, "createdAt": 0, "updatedAt": 0, "__v": 0 },
  getUsers: { "password": 0, "deviceToken": 0, "deviceType": 0, "createdAt": 0, "updatedAt": 0, "__v": 0 },
  linkApp: { "__v": 0, "password": 0 },
  getUserAppById: { "__v": 0, "password": 0 },
  getUserApps: { "__v": 0, "password": 0 }
};

module.exports = {
  /* Admin On-Boarding */
  signUp: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.profilePic = config.get("PATHS").IMAGE.ADMIN.STATIC + req.file.filename;
      }
      req.body.password = await universal.hashPasswordUsingBcrypt(req.body.password);
      await validations.admin.validateSignUp(req, "body");
      const isEmailUsed = await Models.User.findOne({ email: req.body.email, isDeleted: false, type: 'ADMIN' }).lean();
      if (isEmailUsed) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, {}, req.lang);
      }
      const isPhoneUsed = await Models.User.findOne({ phone: req.body.phone, countryCode: req.body.countryCode, isDeleted: false, type: 'ADMIN' }).lean();
      if (isPhoneUsed) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, {}, req.lang);
      }
      req.body.type = "ADMIN"
      let admin = await Models.User(req.body).save();
      admin = await Models.User.findById(ObjectId(admin.id), Projections.signUp).lean();
      admin.authToken = await universal.jwtSign({ _id: admin._id });
      admin = {
        status: CODES.OK,
        message: MESSAGES.ADMIN_REGISTERED_SUCCESSFULLY,
        data: admin
      };
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.ADMIN.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      await validations.admin.validateLogin(req, "body");
      let admin = await Models.User.findOne({ email: req.body.email, isDeleted: false, type: 'ADMIN' }, Projections.login).lean();
      if (!admin) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.ADMIN_NOT_EXIST, {}, req.lang);
      }
      const isPasswordMatched = await universal.comparePasswordUsingBcrypt(req.body.password, admin.password);
      if (!isPasswordMatched) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.PASSWORD_NOT_MATCH, {}, req.lang);
      }
      delete admin.password;
      admin.authToken = await universal.jwtSign({ _id: admin._id });
      admin = {
        status: CODES.OK,
        message: MESSAGES.ADMIN_LOGGED_IN_SUCCESSFULLY,
        data: admin
      };
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      await Models.User.findOneAndUpdate({ _id: ObjectId(req.user._id), type: "ADMIN", isDeleted: false }, { deviceToken: "" }).lean();
      let admin = {
        status: CODES.OK,
        message: MESSAGES.ADMIN_LOGGED_OUT_SUCCESSFULLY,
        data: {}
      };
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getProfile: async (req, res, next) => {
    try {
      let admin = await Models.User.findOne({ _id: ObjectId(req.user._id), isDeleted: false }, Projections.getProfile).lean();
      admin = {
        status: CODES.OK,
        message: MESSAGES.PROFILE_FETCHED_SUCCESSFULLY,
        data: admin
      };
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.profilePic = config.get("PATHS").IMAGE.ADMIN.STATIC + req.file.filename;
      }
      await validations.admin.validateUpdateProfile(req, "body");
      let admin = await Models.User.findOneAndUpdate({ _id: ObjectId(req.user._id), isDeleted: false }, req.body);
      admin = await Models.User.findOne({ _id: ObjectId(req.user._id), isDeleted: false }, Projections.updateProfile).lean();
      admin = {
        status: CODES.OK,
        message: MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
        data: admin
      };
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.ADMIN.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      await validations.admin.validateChangePassword(req, "body");
      const oldPasswordValid = await universal.comparePasswordUsingBcrypt(req.body.oldPassword, req.user.password);
      if (!oldPasswordValid) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.OLD_PASSWORD_IS_INCORRECT, {}, req.lang);
      }
      const newPassword = await universal.hashPasswordUsingBcrypt(req.body.newPassword);
      await Models.User.findOneAndUpdate({ _id: ObjectId(req.user._id), isDeleted: false, type: "ADMIN" }, { password: newPassword });
      return await universal.response(res, CODES.OK, MESSAGES.PASSWORD_CHANGE_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      await validations.admin.validateForgotPassword(req, "body");
      let admin = await Models.User.findOne({ email: req.body.email, isDeleted: false, type: "ADMIN" }).lean();
      if (!admin) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.ADMIN_NOT_EXIST, {}, req.lang);
      }
      const OTP = {
        code: "0000",
        email: admin.email,
        phone: admin.phone,
        countryCode: admin.countryCode,
        type: "PASSWORD",
        expireAt: moment().add(3, 'minutes')
      }
      const OTP_SENT = await Models.Otp.findOne({
        code: "0000",
        email: admin.email,
        phone: admin.phone,
        countryCode: admin.countryCode,
        type: "PASSWORD",
      }).lean();
      if (OTP_SENT && (moment(OTP_SENT.expireAt) >= moment())) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.OTP_ALREADY_SENT_TO_PROVIDED_EMAIL, {}, req.lang);
      }
      await Models.Otp(OTP).save();
      return await universal.response(res, CODES.OK, MESSAGES.OTP_SENT_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      await validations.admin.validateResetPassword(req, "body");
      const { email, code } = req.body;
      const OTP = await Models.Otp.findOne({ email, code, type: "PASSWORD" }).lean();
      if (!OTP) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.INCORRECT_OTP, {}, req.lang);
      }
      if (moment(OTP.expireAt) <= moment()) {
        await Models.Otp.findOneAndDelete({ _id: ObjectId(OTP._id) });
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.OTP_EXPIRED, {}, req.lang);
      }
      const newPassword = await universal.hashPasswordUsingBcrypt(req.body.password);
      await Models.User.findOneAndUpdate({ email: req.body.email, isDeleted: false }, { password: newPassword });
      await Models.Otp.findOneAndDelete({ _id: ObjectId(OTP._id) });
      return await universal.response(res, CODES.OK, MESSAGES.PASSWORD_RESET_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /* Manage Apps */
  createApp: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.icon = config.get("PATHS").IMAGE.APP.STATIC + req.file.filename;
      }
      await validations.admin.validateCreateApp(req, "body");
      req.body.createdBy = req.user._id;
      req.body.updatedBy = req.user._id;
      req.body.status = 'ACTIVE';
      let app = await Models.App(req.body).save();
      app = await Models.App.findById(ObjectId(app.id), Projections.createApp).lean();
      app = {
        status: CODES.OK,
        message: MESSAGES.APP_CREATED_SUCCESSFULLY,
        data: app
      };
      return await universal.response(res, app.status, app.message, app.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.APP.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  getApps: async (req, res, next) => {
    try {
      let apps = await Models.App.find({ isDeleted: false }, Projections.getApps).lean();
      apps = {
        status: CODES.OK,
        message: MESSAGES.APPS_FETCHED_SUCCESSFULLY,
        data: { records: apps }
      };
      return await universal.response(res, apps.status, apps.message, apps.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getApp: async (req, res, next) => {
    try {
      await validations.admin.validateGetApp(req,"params");
      let app = await Models.App.findOne({ _id: ObjectId(req.params.id) }, Projections.getApp).lean();
      if(!app){
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.APP_NOT_EXIST, {}, req.lang);
      }
      app = {
        status: CODES.OK,
        message: MESSAGES.APP_FETCHED_SUCCESSFULLY,
        data: app
      };
      return await universal.response(res, app.status, app.message, app.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateApp: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.icon = config.get("PATHS").IMAGE.APP.STATIC + req.file.filename;
      }
      await validations.admin.validateUpdateApp(req, "body");
      req.body.updatedBy = req.user._id;
      let app = await Models.App.findOne({ _id: ObjectId(req.params.id) }, Projections.updateApp).lean();
      if(!app){
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.APP_NOT_EXIST, {}, req.lang);
      }
      await Models.App.findOneAndUpdate({_id: ObjectId(req.params.id)}, req.body);
      app = await Models.App.findById(ObjectId(app._id), Projections.updateApp).lean();
      app = {
        status: CODES.OK,
        message: MESSAGES.APP_UPDATED_SUCCESSFULLY,
        data: app
      };
      return await universal.response(res, app.status, app.message, app.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.APP.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  }, 
  /* Manage News */
  createNews: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.icon = config.get("PATHS").IMAGE.NEWS.STATIC + req.file.filename;
      }
      await validations.admin.validateCreateNews(req, "body");
      req.body.createdBy = req.user._id;
      req.body.updatedBy = req.user._id;
      let news = await Models.News(req.body).save();
      news = await Models.News.findById(ObjectId(news.id), Projections.createNews).lean();
      news = {
        status: CODES.OK,
        message: MESSAGES.NEWS_CREATED_SUCCESSFULLY,
        data: news
      };
      return await universal.response(res, news.status, news.message, news.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.NEWS.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  getNews: async (req, res, next) => {
    try {
      let news = await Models.News.find({ isDeleted: false }, Projections.getNews).lean();
      news = {
        status: CODES.OK,
        message: MESSAGES.NEWS_FETCHED_SUCCESSFULLY,
        data: { records: news }
      };
      return await universal.response(res, news.status, news.message, news.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /* Manage Users */
  createUser: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.profilePic = config.get("PATHS").IMAGE.USER.STATIC + req.file.filename;
      }
      req.body.password = await universal.hashPasswordUsingBcrypt(req.body.password);
      await validations.admin.validateCreateUser(req, "body");
      const isEmailUsed = await Models.Customer.findOne({ email: req.body.email, isDeleted: false }).lean();
      if (isEmailUsed) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, {}, req.lang);
      }
      const isPhoneUsed = await Models.Customer.findOne({ phone: req.body.phone, countryCode: req.body.countryCode, isDeleted: false }).lean();
      if (isPhoneUsed) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT, {}, req.lang);
      }
      req.body.createdBy = req.user._id;
      req.body.updatedBy = req.user._id;
      let customer = await Models.Customer(req.body).save();
      customer = await Models.Customer.findById(ObjectId(customer.id), Projections.createUser).lean();
      customer = {
        status: CODES.OK,
        message: MESSAGES.CUSTOMER_CREATED_SUCCESSFULLY,
        data: customer
      };
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.USER.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      let customers = await Models.Customer.find({ isDeleted: false }, Projections.getUsers).lean();
      customers = {
        status: CODES.OK,
        message: MESSAGES.CUSTOMERS_FETCHED_SUCCESSFULLY,
        data: { records: customers }
      };
      return await universal.response(res, customers.status, customers.message, customers.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /* Manage Users App */
  linkApp: async (req, res, next) => {
    try {
      await validations.admin.validateLinkApp(req, "body");
      req.body.createdBy = req.user._id;
      req.body.updatedBy = req.user._id;
      const customerExist = await Models.Customer.findOne({ _id: ObjectId(req.body.customer), isDeleted: false }).lean();
      if (!customerExist) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.CUSTOMER_NOT_EXIST, {}, req.lang);
      }
      const appExist = await Models.App.findOne({ _id: ObjectId(req.body.app), isDeleted: false }).lean();
      if (!appExist) {
        return await universal.response(res, CODES.BAD_REQUEST, MESSAGES.APP_NOT_EXIST, {}, req.lang);
      }
      let customerApp = await Models.CustomerApp(req.body).save();
      customerApp = await Models.CustomerApp.findById(ObjectId(customerApp.id), Projections.linkApp).lean();
      customerApp = {
        status: CODES.OK,
        message: MESSAGES.CUSTOMER_APP_ADDED_SUCCESSFULLY,
        data: customerApp
      };
      return await universal.response(res, customerApp.status, customerApp.message, customerApp.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getUserApps: async (req, res, next) => {
    try {
      let customerApps = await Models.CustomerApp.find({ customer: ObjectId(req.params.id), isDeleted: false }, Projections.getUserApps).lean();
      customerApps = {
        status: CODES.OK,
        message: MESSAGES.CUSTOMER_APPS_FETCHED_SUCCESSFULLY,
        data: { records: customerApps }
      };
      return await universal.response(res, customerApps.status, customerApps.message, customerApps.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getUserAppById: async (req, res, next) => {
    try {
      let customerApp = await Models.CustomerApp.findOne({ _id: ObjectId(req.params.id), isDeleted: false }, Projections.getUserAppById).lean();
      customerApp = {
        status: CODES.OK,
        message: MESSAGES.CUSTOMER_APP_FETCHED_SUCCESSFULLY,
        data: customerApp
      };
      return await universal.response(res, customerApp.status, customerApp.message, customerApp.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
