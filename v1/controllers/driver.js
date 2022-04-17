const config = require("config");
const validations = require("../validations");
const universal = require("../../utils");
const service = require("../services");
const moment = require("moment");
const messages = require("../../constants").Messages;
const codes = require("../../constants").Codes;
const services = require("../services");
const { Socket } = require("../../utils/Sockets");
const fcm = require("../../utils/Notification");
const { Promo } = require("../../models");
module.exports = {
  /*
    Driver On-Boarding
    */
  signUp: async (req, res, next) => {
    try {
      await validations.driver.validateSignUp(req, "body");
      let driver = await service.driver.Create(req.body);
      return await universal.response(res, driver.status, driver.message, driver.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      await validations.driver.validatelogin(req, "body");
      let password = req.body.password;
      delete req.body.password;
      let { deviceType, deviceToken } = req.body;
      console.log({deviceType, deviceToken});
      if (deviceType) delete req.body.deviceType;
      if (deviceToken) delete req.body.deviceToken;
      let driver = await service.driver.FindWithPassword(req.body);
      if (driver.status == 200) {
        if (driver.data.isBlocked) return await universal.response(res, driver.status, messages.DRIVER_IS_BLOCKED_BY_ADMIN, {}, req.lang);
        let isMatched = await universal.comparePasswordUsingBcrypt(password, driver.data.password);
        if (isMatched) {
          if (deviceType && deviceToken) driver = await service.driver.Update(driver.data._id, { deviceType: deviceType, deviceToken: deviceToken });
          delete driver.data.password;
          driver.data.auth = await universal.jwtSign(driver.data);
          return await universal.response(res, driver.status, messages.DRIVER_LOGGED_IN_SUCCESSFULLY, driver.data, req.lang);
        }
        return await universal.response(res, codes.BAD_REQUEST, messages.INVALID_CREDENTIALS, "", req.lang);
      }
      return await universal.response(res, driver.status, messages.DRIVER_NOT_EXIST, driver.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      await validations.driver.validateVerifyEmail(req, "body");
      let findObj = { email: req.user.email, phone: req.user.phone, countryCode: req.user.countryCode, code: req.body.code };
      let otp = await service.otpDriver.Find(findObj);
      return await universal.response(res, otp.status, otp.message, otp.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verifyOtpUpdate: async (req, res, next) => {
    try {
      await validations.driver.validateVerifyOtp(req, "body");
      let findObj = {};
      if (req.user && req.params.type == "signup") {
        findObj = { email: req.body.email, code: req.body.code, actualEmail: req.user.email };
      } else if (req.user && req.params.type != "signup") {
        findObj = { email: req.user.email, code: req.body.code };
      } else {
        findObj = { email: req.body.email, code: req.body.code };
      }
      let otp = await service.otpDriver.Find(findObj);
      if (otp.status == 200) {
        if (req.params.type == "forgot") otp.data.auth = await universal.jwtSign(otp.data);
        if (req.user && req.params.type == "signup") {
          let driver = await services.driver.Update(req.user._id, { isEmailVerify: true, email: findObj.email });
          otp.data = driver.data;
        }
        return await universal.response(res, otp.status, otp.message, otp.data, req.lang);
      }
      return await universal.response(res, otp.status, otp.message, otp.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  resendOtp: async (req, res, next) => {
    try {
      let otp = {};
      if (req.user && req.params.type != "update") otp = await service.otpDriver.Create(req.user);
      else {
        await validations.driver.validateResendOtp(req, "body");
        otp = await service.otpDriver.Create(req.body);
      }
      if (otp.status == 200) {
        if (req.params.type == "forgot") {
          let driver = otp.data;
          universal.emailService.sendEmail(driver.email, config.get("EMAIL_SERVICE").SUBJECTS.DRIVER_FORGOT_PASSWORD_OTP, driver.code);
        } else if (req.params.type == "signup" || req.params.type == "update") {
          let driver = otp.data;
          universal.emailService.sendEmail(driver.email, config.get("EMAIL_SERVICE").SUBJECTS.DRIVER_REGISTRATION_OTP, driver.code);
        }
      }
      otp.status = codes.OK;
      return await universal.response(res, otp.status, otp.message, "", req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      await validations.driver.validateForgotPassword(req, "body");
      let driver = await service.driver.Find({ email: req.body.email });
      if (driver.status == 200) {
        let otp = await service.otpDriver.Create({ email: driver.data[0].email, phone: driver.data[0].phone, countryCode: driver.data[0].countryCode });
        if (otp.status == 200) {
          await universal.emailService.sendEmail(driver.data[0].email, config.get("EMAIL_SERVICE").SUBJECTS.DRIVER_FORGOT_PASSWORD_OTP, otp.data.code);
        }
        return await universal.response(res, otp.status, otp.message, "", req.lang);
      }
      return await universal.response(res, driver.status, driver.message, "", req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      await validations.driver.validateResetPassword(req, "body");
      let driver = await service.driver.Update(req.user._id, { password: req.body.password });
      return await universal.response(res, driver.status, driver.message, "", req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      await validations.driver.validateChangePassword(req, "body");
      let isMatch = await universal.comparePasswordUsingBcrypt(req.body.oldPassword, req.user.password);
      if (!isMatch) {
        return await universal.response(res, codes.BAD_REQUEST, messages.OLD_PASSWORD_IS_INCORRECT, "", req.lang);
      }
      let driver = await service.driver.Update(req.user._id, { password: req.body.newPassword });
      return await universal.response(res, driver.status, driver.message, "", req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  completeProfile: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.profilePic = config.get("PATHS").IMAGE.DRIVER.STATIC + req.file.filename;
      }
      await validations.driver.validateCompleteProfile(req, "body");
      req.body.profileStatus = 1;
      let driver = await service.driver.Update(req.user._id, req.body);
      return await universal.response(res, driver.status, driver.message, driver.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.DRIVER.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  uploadDocuments: async (req, res, next) => {
    try {
      if (req.files) req.body.documents = await req.files.map((image) => config.get("PATHS").FILE.DRIVER.STATIC + image.filename);
      await validations.driver.validateUploadDocuments(req, "body");
      req.body.profileStatus = 2;
      let driver = await service.driver.Update(req.user._id, req.body);
      return await universal.response(res, driver.status, driver.message, driver.data, req.lang);
    } catch (error) {
      if (req.files) {
        let paths = await req.files.map((image) => config.get("PATHS").FILE.DRIVER.ACTUAL + image.filename);
        await universal.deleteFiles(paths);
      }
      console.log(error);
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      await service.driver.Update(req.user._id, { deviceToken: "", deviceType: "" });
      return await universal.response(res, codes.OK, messages.DRIVER_LOGOUT_SUCCESSFULLY, "", req.lang);
    } catch (error) {
      next(error);
    }
  },
  /*
    CRUDs
    */
  getProfile: async (req, res, next) => {
    try {
      let driver = await service.driver.Find({ _id: req.user._id });
      return await universal.response(res, driver.status, driver.message, driver.data[0], req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  editProfile: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.profilePic = config.get("PATHS").IMAGE.DRIVER.STATIC + req.file.filename;
        if (req.user.profilePic != "") await universal.deleteFiles([config.get("PATHS").IMAGE.DRIVER.ACTUAL + req.user.profilePic.split("/")[req.user.profilePic.split("/").length - 1]]);
      }
      await validations.driver.validateEditProfile(req, "body");
      if (req.body.sst) req.body.sst = String(moment(req.body.sst).format("LT"));
      if (req.body.est) req.body.est = String(moment(req.body.est).format("LT"));
      if (req.body.email) {
        let otp = await service.otp.Create(req.body);
        await universal.emailService.sendEmail(otp.data.email, config.get("EMAIL_SERVICE").SUBJECTS.DRIVER_REGISTRATION_OTP, otp.data.code);
        delete req.body.email;
      }
      let driver = await service.driver.Update(req.user._id, req.body);
      return await universal.response(res, driver.status, driver.message, driver.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.DRIVER.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  /*
    DropDowns
    */
  dropDowns: async (req, res, next) => {
    try {
      if (req.params.type === "banks") {
        await REDIS_CLIENT.lrange("banks", 0, -1, async (err, data) => {
          if (data.length === 0) {
            let banks = await service.bank.FindAll();
            banks.data = await banks.data.map((item) => item.name);
            await REDIS_CLIENT.rpush(["banks", ...banks.data]);
            await REDIS_CLIENT.expire("banks", 86400);
            return await universal.response(res, banks.status, banks.message, banks.data, req.lang);
          } else {
            return await universal.response(res, codes.OK, messages.BANKS_FETCHED_SUCCESSFULLY, data, req.lang);
          }
        });
      } else if (req.params.type === "capacity") {
        await REDIS_CLIENT.lrange("capacities", 0, -1, async (err, data) => {
          if (data.length === 0) {
            let fuelProducts = await service.fuelProduct.Find({});
            fuelProducts.data = await fuelProducts.data.map((item) => item.capacity);
            fuelProducts.data = [...new Set(fuelProducts.data)];
            await fuelProducts.data.sort((a, b) => a - b);
            fuelProducts.data = await fuelProducts.data.map(String);
            await REDIS_CLIENT.rpush(["capacities", ...fuelProducts.data]);
            await REDIS_CLIENT.expire("capacities", 86400);
            return await universal.response(res, fuelProducts.status, fuelProducts.message, fuelProducts.data, req.lang);
          } else {
            return await universal.response(res, codes.OK, messages.CAPACITIES_FETCHED_SUCCESSFULLY, data, req.lang);
          }
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    Bookings
    */
  getBooking: async (req, res, next) => {
    try {
      if (req.query.id) {
        // (findObj,page=1,limit=10,projection = null)
        let booking = await services.booking.FindBookingsWithPage({ _id: req.query.id,driver: req.user._id }, req.query.page);
        
        return await universal.response(res, booking.status, booking.message, booking.data[0], req.lang);
      } else if (req.params.type == "ongoing") {
        let booking = await services.booking.FindBookingsWithPage({ driver: req.user._id, status: { $in: [3, 4] } }, req.query.page);
        return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
      } else {
        let booking = await services.booking.FindBookingsWithPage({ driver: req.user._id, status: { $in: [5, 6] } }, req.query.page);
        return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateBooking: async (req, res, next) => {
    try {
      console.log({ driver: "updateBooking" });
      await validations.driver.validateUpdateBooking(req, "body");
      if (req.params.type == "arrived") {
        console.log({ arrived: "arrived" });
        let booking = await service.booking.Update(req.body.bookingId, { status: 4 });
        let customerId = booking.data.customer;
        booking = await service.booking.FindWithAggregate({ _id: req.body.bookingId });
        for(const x in booking.data){
          let _booking = booking.data[x];
          if (_booking.promo){
            const promo = await Promo.findById(_booking.promo, {admin:0, createdAt: 0, updatedAt: 0});
            _booking.promo = promo;
          }
        }
        console.log({id: customerId});
        let sendBooking = await service.booking.FindAndLookup({ _id: req.body.bookingId });
        Socket.emitToRoom(customerId, "receiveBooking", sendBooking.data[0]);
        let customer = await service.customer.FindWithPassword({ _id: customerId });
        console.log({customer: customer.data});
        // fcm.pushNotification(customer.data.deviceType, customer.data.deviceToken, "Booking Arrived", `Booking has been Arrived`, sendBooking.data[0]);
        await service.notification.Create({ userId: customerId, title: "Booking Arrived", body: `Booking Arrived`, message: JSON.stringify(sendBooking.data[0]), image: "done.svg" });
        Socket.emit("receiveBookingAdmin", booking.data[0]);
        return await universal.response(res, codes.OK, booking.message, booking.data[0], req.lang);
      }
      if (req.params.type == "delivered") {
        
        let booking = await service.booking.Update(req.body.bookingId, { status: 5, deliveredAt: Date.now() });
        let customerId = booking.data.customer;
        booking = await service.booking.FindWithAggregate({ _id: req.body.bookingId });
        for(const x in booking.data){
          let _booking = booking.data[x];
          if (_booking.promo){
            const promo = await Promo.findById(_booking.promo, {admin:0, createdAt: 0, updatedAt: 0});
            _booking.promo = promo;
          }
        }
        console.log({id: customerId});
        let sendBooking = await service.booking.FindAndLookup({ _id: req.body.bookingId });
        Socket.emitToRoom(customerId, "receiveBooking", sendBooking.data[0]);
        let customer = await service.customer.FindWithPassword({ _id: customerId });
        console.log({customer: customer.data});
        // fcm.pushNotification(customer.data.deviceType, customer.data.deviceToken, "Booking Delivered", `Booking has been Delivered`, sendBooking.data[0]);
        await service.notification.Create({ userId: customerId, title: "Booking Delivered", body: `Booking Delivered`, message: JSON.stringify(sendBooking.data[0]), image: "done.svg" });
        Socket.emit("receiveBookingAdmin", booking.data[0]);
        return await universal.response(res, codes.OK, booking.message, booking.data[0], req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    Contact Us
    */
  contactUs: async (req, res, next) => {
    try {
      await validations.driver.validateContactUs(req, "body");
      universal.emailService.sendEmail(req.body.email, config.get("EMAIL_SERVICE.SUBJECTS.DRIVER_CONATCT_US"), req.body.message);
      let form = await services.contactForm.Create(req.body);
      return await universal.response(res, form.status, messages.MESSAGE_SENT_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    Notifications
    */
  getNotifications: async (req, res, next) => {
    try {
      let notifications = await services.notification.Find({ userId: req.user._id });
      return await universal.response(res, notifications.status, notifications.message, notifications.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getNotificationsWithPagination: async (req, res, next) => {
    try {
      req.query.userId = req.user._id;
      let notifications = await services.notification.Pagination(req.query);
      return await universal.response(res, notifications.status, notifications.message, notifications.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
