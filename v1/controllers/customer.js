const config = require("config");
const validations = require("../validations");
const universal = require("../../utils");
const service = require("../services");
const messages = require("../../constants").Messages;
const codes = require("../../constants").Codes;
const services = require("../services");
const moment = require("moment");
const mongoose = require("mongoose");
const agenda = require("../../utils/Scheduling");
const { Socket } = require("../../utils/Sockets");
const models = require("../../models");
const { Promo } = require("../../models");
const promo = require("../../models/promo");

module.exports = {
  /*
    Customer On-Boarding
    */
  signUp: async (req, res, next) => {
    try {
      await validations.customer.validateSignUp(req, "body");
      let customer = await service.customer.Create(req.body);
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      await validations.customer.validatelogin(req, "body");
      let password = req.body.password;
      delete req.body.password;
      let { deviceType, deviceToken } = req.body;
      if (deviceType) delete req.body.deviceType;
      if (deviceToken) delete req.body.deviceToken;
      let customer = await service.customer.FindWithPassword(req.body);
      if (customer.status == 200) {
        if (customer.data.isBlocked) {
          return await universal.response(res, customer.status, messages.CUSTOMER_IS_BLOCKED_BY_ADMIN, {}, req.lang);
        }
        let isMatched = await universal.comparePasswordUsingBcrypt(password, customer.data.password);
        if (isMatched) {
          if (deviceType && deviceToken)
            customer = await service.customer.Update(customer.data._id, { deviceType: deviceType, deviceToken: deviceToken });
          delete customer.data.password;
          customer.data.auth = await universal.jwtSign(customer.data);
          return await universal.response(res, customer.status, messages.CUSTOMER_LOGGED_IN_SUCCESSFULLY, customer.data, req.lang);
        }
        return await universal.response(res, codes.BAD_REQUEST, messages.INVALID_CREDENTIALS, "", req.lang);
      }
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      await validations.customer.validateVerifyEmail(req, "body");
      let findObj = { email: req.user.email, phone: req.user.phone, countryCode: req.user.countryCode, code: req.body.code };
      let otp = await service.otp.Find(findObj);
      return await universal.response(res, otp.status, otp.message, otp.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verifyOtp: async (req, res, next) => {
    try {
      await validations.customer.validateVerifyOtp(req, "body");
      let findObj = {};
      if (req.user && req.params.type == "signup") {
        findObj = { email: req.body.email, code: req.body.code, actualEmail: req.user.email };
      } else if (req.user && req.params.type != "signup") {
        findObj = { email: req.user.email, code: req.body.code };
      } else {
        findObj = { email: req.body.email, code: req.body.code };
      }
      let otp = await service.otp.Find(findObj);
      if (otp.status == 200) {
        if (req.params.type == "forgot") otp.data.auth = await universal.jwtSign(otp.data);
        if (req.user && req.params.type == "signup") {
          let customer = await services.customer.Update(req.user._id, { isEmailVerify: true, email: findObj.email });
          otp.data = customer.data;
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
      if (req.user && req.params.type != "update") otp = await service.otp.Create(req.user);
      else {
        await validations.customer.validateResendOtp(req, "body");
        otp = await service.otp.Create(req.body);
      }
      if (otp.status == 200) {
        if (req.params.type == "forgot") {
          let customer = otp.data;
          await universal.emailService.sendEmail(customer.email, config.get("EMAIL_SERVICE").SUBJECTS.CUSTOMER_FORGOT_PASSWORD_OTP, customer.code);
        } else if (req.params.type == "signup" || req.params.type == "update") {
          let customer = otp.data;
          await universal.emailService.sendEmail(customer.email, config.get("EMAIL_SERVICE").SUBJECTS.CUSTOMER_REGISTRATION_OTP, customer.code);
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
      await validations.customer.validateForgotPassword(req, "body");
      let customer = await service.customer.Find({ email: req.body.email });
      if (customer.status == 200) {
        let otp = await service.otp.Create({
          email: customer.data[0].email,
          phone: customer.data[0].phone,
          countryCode: customer.data[0].countryCode,
        });
        if (otp.status == 200) {
          await universal.emailService.sendEmail(
            customer.data[0].email,
            config.get("EMAIL_SERVICE").SUBJECTS.CUSTOMER_FORGOT_PASSWORD_OTP,
            otp.data.code
          );
        }
        return await universal.response(res, otp.status, otp.message, "", req.lang);
      }
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      await validations.customer.validateResetPassword(req, "body");
      let customer = await service.customer.Update(req.user._id, { password: req.body.password });
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      await validations.customer.validateChangePassword(req, "body");
      let isMatch = await universal.comparePasswordUsingBcrypt(req.body.oldPassword, req.user.password);
      if (!isMatch) {
        return await universal.response(res, codes.BAD_REQUEST, messages.OLD_PASSWORD_IS_INCORRECT, "", req.lang);
      }
      let customer = await service.customer.Update(req.user._id, { password: req.body.newPassword });
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  completeProfile: async (req, res, next) => {
    try {
      if (req.user.profileStatus == "COMPLETED") {
        if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.CUSTOMER.ACTUAL + req.file.filename]);
        return await universal.response(res, codes.BAD_REQUEST, messages.CUSTOMER_PROFILE_ALREADY_COMPLETED, "", req.lang);
      }
      if (req.file) {
        req.body.profilePic = config.get("PATHS").IMAGE.CUSTOMER.STATIC + req.file.filename;
      }
      if (req.body.deliveryAddresses) {
        req.body.deliveryAddresses = JSON.parse(req.body.deliveryAddresses);
      }
      await validations.customer.validateCompleteProfile(req, "body");
      if (req.body.deliveryAddresses) {
        req.body.deliveryAddresses = await req.body.deliveryAddresses.map((item) => (item = { ...item, customerId: req.user._id }));
        await req.body.deliveryAddresses.forEach(async (item) => {
          await service.deliveryAddress.Create(item);
        });
      }
      delete req.body.deliveryAddresses;
      req.body.profileStatus = "COMPLETED";
      let customer = await service.customer.Update(req.user._id, req.body);
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.CUSTOMER.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      await service.customer.Update(req.user._id, { deviceToken: "", deviceType: "" });
      return await universal.response(res, codes.OK, messages.CUSTOMER_LOGOUT_SUCCESSFULLY, "", req.lang);
    } catch (error) {
      next(error);
    }
  },
  /*
    CRUDs
    */
  getProfile: async (req, res, next) => {
    try {
      let customer = await service.customer.Find({ _id: req.user._id });
      return await universal.response(res, customer.status, customer.message, customer.data[0], req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  editProfile: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.profilePic = config.get("PATHS.IMAGE.CUSTOMER.STATIC") + req.file.filename;
        if (req.user.profilePic != "")
          await universal.deleteFiles([
            config.get("PATHS.IMAGE.CUSTOMER.ACTUAL") + req.user.profilePic.split("/")[req.user.profilePic.split("/").length - 1],
          ]);
      }
      await validations.customer.validateEditProfile(req, "body");
      if (req.body.email) {
        let otp = await service.otp.Create(req.body);
        universal.emailService.sendEmail(otp.data.email, config.get("EMAIL_SERVICE").SUBJECTS.CUSTOMER_REGISTRATION_OTP, otp.data.code);
        delete req.body.email;
      }
      let customer = await service.customer.Update(req.user._id, req.body);
      return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.CUSTOMER.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  /*
    Home
    */
  home: async (req, res, next) => {
    try {
      let deliveryAddresses = await services.deliveryAddress.Find({ customerId: req.user._id });
      let fuelcategories = await services.fuelCategory.Find({});
      let products = await services.fuelProduct.Find({});
      let capacities = await products.data.map((item) => item.capacity);
      capacities = [...new Set(capacities)];
      await capacities.sort((a, b) => a - b);
      capacities = await capacities.map(String);
      let sendObj = {
        deliveryAddresses: deliveryAddresses.data,
        fuelCategories: fuelcategories.data,
        products: products.data,
        capacities: capacities,
      };
      return await universal.response(res, codes.OK, messages.HOME_DATA_FETCHED_SUCCESSFULLY, sendObj, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getProducts: async (req, res, next) => {
    try {
      let products = { status: codes.OK, message: messages.FUEL_PRODUCTS_FETCHED_SUCCESSFULLY };
      products = await services.fuelProduct.Find(req.query);
      return await universal.response(res, products.status, products.message, products.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    cards
    */
  addCard: async (req, res, next) => {
    try {
      await validations.customer.validateaddCard(req, "body");
      req.body.customerId = mongoose.Types.ObjectId(req.user._id);
      let card = await services.card.Create(req.body);
      let cardData = {
        _id: card.data._id,
        fullName: card.data.fullName,
        cardNumber: card.data.cardNumber,
        cardId: card.data.cardId,
        expireDate: card.data.expireDate,
        customerId: card.data.customerId,
      };
      return await universal.response(res, card.status, card.message, cardData, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateCard: async (req, res, next) => {
    try {
      await validations.customer.validateUpdateCard(req, "body");
      let card = await services.card.FindAndUpdate(
        { customerId: mongoose.Types.ObjectId(req.user._id), _id: mongoose.Types.ObjectId(req.body.id) },
        {
          cardNumber: req.body.cardNumber,
          expireDate: req.body.expireDate,
          fullName: req.body.fullName,
          __enc_cardNumber: false,
          __enc_expireDate: false,
        }
      );
      let cardData = {
        _id: card.data._id,
        fullName: card.data.fullName,
        cardNumber: card.data.cardNumber,
        cardId: card.data.cardId,
        expireDate: card.data.expireDate,
      };
      return await universal.response(res, card.status, card.message, cardData, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteCard: async (req, res, next) => {
    try {
      let card = await services.card.FindAndUpdate(
        { customerId: mongoose.Types.ObjectId(req.user._id), cardId: mongoose.Types.ObjectId(req.body.id) },
        {
          isDeleted: true,
          __enc_cardNumber: false,
          __enc_expireDate: false,
        }
      );
      return await universal.response(res, card.status, messages.CARD_DELETED_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  viewCard: async (req, res, next) => {
    try {
      let card = await services.card.Find({ customerId: mongoose.Types.ObjectId(req.user._id) });
      var cardInfo = card.data.map(function (card) {
        if (card.isDeleted === false) {
          var info = {
            _id: card._id,
            fullName: card.fullName,
            cardNumber: card.cardNumber,
            cardId: card.cardId,
            expireDate: card.expireDate,
          };
          return info;
        }
      });

      return await universal.response(res, card.status, card.message, cardInfo, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    DeliveryAddresses
    */
  getDeliveryAddresses: async (req, res, next) => {
    try {
      let addresses = await services.deliveryAddress.Find({ customerId: req.user._id });
      return await universal.response(res, addresses.status, addresses.message, addresses.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addDeliveryAddresses: async (req, res, next) => {
    try {
      await validations.customer.validateAddDeliveryAddresses(req, "body");
      req.body.customerId = mongoose.Types.ObjectId(req.user._id);
      let addresses = await services.deliveryAddress.Create(req.body);
      return await universal.response(res, addresses.status, addresses.message, addresses.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteDeliveryAddresses: async (req, res, next) => {
    try {
      let address = await services.deliveryAddress.Find({
        _id: mongoose.Types.ObjectId(req.query.id),
        customerId: mongoose.Types.ObjectId(req.user._id),
      });
      if (address.data.length == 0) return await universal.response(res, codes.BAD_REQUEST, messages.DELIVERY_ADDRESS_NOT_EXIST, "", req.lang);
      address = await services.deliveryAddress.Update(address.data[0]._id, { isDeleted: true });
      return await universal.response(res, address.status, messages.DELIVERY_ADDRESSES_DELETED_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateDeliveryAddresses: async (req, res, next) => {
    try {
      await validations.customer.validateUpdateAddress(req, "body");
      console.log({ body: req.body });
      let address = await services.deliveryAddress.Find({
        _id: mongoose.Types.ObjectId(req.query.id),
        customerId: mongoose.Types.ObjectId(req.user._id),
      });
      if (address.data.length == 0) return await universal.response(res, codes.BAD_REQUEST, messages.DELIVERY_ADDRESS_NOT_EXIST, "", req.lang);
      delete req.body.id;
      address = await services.deliveryAddress.Update(address.data[0]._id, req.body);
      return await universal.response(res, address.status, address.message, address.data, req.lang);
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
      await validations.customer.validateContactUs(req, "body");
      universal.emailService.sendEmail(req.body.email, config.get("EMAIL_SERVICE.SUBJECTS.CUSTOMER_CONATCT_US"), req.body.message);
      let form = await services.contactForm.Create(req.body);
      return await universal.response(res, form.status, messages.MESSAGE_SENT_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    Booking
    */
  createBooking: async (req, res, next) => {
    try {
      await validations.customer.validateCreateBooking(req, "body");
      req.body.customer = req.user._id;
      if (req.body.date) req.body.date = moment(req.body.date);
      if (req.body.product) {
        let product = await service.fuelProduct.Find({ _id: req.body.product });
        req.body.amount = product.data[0].price;
      }
      if(req.promo) {
        const promo = await service.promo.Find({_id: req.promo})
        if(!promo) await universal.response(res, codes.BAD_REQUEST, messages.INVALID_PROMO, {}, req.lang);
      }
      const booking = await services.booking.Create(req.body);
      console.log({booking});
      if (booking.bookingType == "NOW") Socket.emit("newBooking", booking.data);
      if (booking.bookingType == "SHEDULED") {
        console.log("SHEDULED")
        booking.sheduledDate = req.body.sheduledDate;
        await booking.save();
      }
      const admin = await models.Admin.findOne({ email: "rohit@gmail.com" });
      agenda.willNotify(req.user, admin, booking);
      return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getBooking: async (req, res, next) => {
    try {
      if (req.params.type == "ongoing") {
        let booking = await services.booking.FindAndLookup({ customer: req.user._id, status: { $in: [0, 1, 2, 3, 4] } }, req.query.page > 1 ? Number(req.query.page) : 1);
        for(const x in booking.data){
          let _booking = booking.data[x];
          if (_booking.promo){
            const promo = await Promo.findById(_booking.promo, {admin:0, createdAt: 0, updatedAt: 0});
            console.log({promo});
            _booking.promo = promo;
          }
        }
        return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
      } else {
        let booking = await services.booking.FindAndLookup({ customer: req.user._id, status: { $in: [5, 6] } },req.query.page > 1 ? Number(req.query.page) : 1);
        for(const x in booking.data){
          let _booking = booking.data[x];
          if (_booking.promo){
            const promo = await Promo.findById(_booking.promo,{admin:0, createdAt: 0, updatedAt: 0});
            console.log({promo});
            _booking.promo = promo;
          }
        }
        return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  cancelBooking: async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      let booking = await service.booking.Find({ _id: bookingId });
      booking = await service.booking.Update(bookingId, { cancelledBooking: [...req.user.cancelledBooking, bookingId], isCancelled: true });
      booking.message = messages.BOOKING_CANCELLED_SUCCESSFULLY;
      return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },
  getBookingDetail: async (req, res, next) => {
    try {
      await validations.customer.getBookingDetailValidation(req, "params");
      const { bookingId } = req.params;
      const booking = await service.booking.FindAndLookup({ _id: bookingId });
      if (booking.data[0].promo) {
        console.log({ promo: booking.data[0].promo });
        const promo = await Promo.findById(booking.data[0].promo, {createdAt: 0, updatedAt: 0, admin: 0});
        booking.data[0].promo = promo;
      }
      return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },
  /*
    Notifications
    */
  getNotifications: async (req, res, next) => {
    try {
      const page = Number(req.query.page) > 1 ? Number(req.query.page) : 1;
      let notifications = await services.notification.Find({ userId: req.user._id }, page);
      const total = await models.Notification.find({ userId: req.user._id }).countDocuments();
      return await universal.response(res, notifications.status, notifications.message, {totalPages: Math.ceil(total/10), notifications: notifications.data}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  /**
   * Wallet Routes
   */

  addToWallet: async (req, res, next) => {
    try {
      const customer = req.user;
      await validations.customer.addMoneyValidate(req, "body");
      const updatedWallet = await services.wallet.Update(customer, req.body.amount);
      return await universal.response(res, updatedWallet.status, updatedWallet.message, updatedWallet.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getTransaction: async (req, res, next) => {
    try {
      const transactions = await services.wallet.Find({ userId: mongoose.Types.ObjectId(req.user._id) });
      return await universal.response(res, transactions.status, transactions.message, transactions.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
