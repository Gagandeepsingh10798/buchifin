const config = require("config");
const validations = require("../validations");
const universal = require("../../utils");
const service = require("../services");
const messages = require("../../constants").Messages;
const codes = require("../../constants").Codes;
const mongoose = require("mongoose");
const services = require("../services");
const { Socket } = require("../../utils/Sockets");
const fcm = require("../../utils/Notification");
const models = require("../../models");
const moment = require("moment");
const fs = require("fs");
const { Parser } = require("json2csv");
const path = require("path");
const Model = require("../../models");
const _ = require("lodash");
const utils = require("../../utils");

module.exports = {
  /*
    Admin On-Boarding
    */
  signUp: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.profilePic = config.get("PATHS").IMAGE.ADMIN.STATIC + req.file.filename;
      }
      await validations.admin.validateSignUp(req, "body");
      let admin = await service.admin.Create(req.body);
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
      let admin = await service.admin.Find(req.body);
      if (admin.status == 400) return await universal.response(res, codes.BAD_REQUEST, messages.INVALID_CREDENTIALS, {}, req.lang);
      let isMatched = await universal.comparePasswordUsingBcrypt(req.body.password, admin.data.password);
      if (!isMatched) return await universal.response(res, codes.BAD_REQUEST, messages.INVALID_CREDENTIALS, {}, req.lang);
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      await validations.admin.updateprofileValidation(req.body);
      const updatedAdmin = await services.admin.Update(req.user._id, { ...req.body });
      // if (req.file) {
      //   req.body.profilePic = config.get("PATHS.IMAGE.ADMIN.STATIC") + req.file.filename;
      //   if (req.user.profilePic != "")
      //     await universal.deleteFiles([
      //       config.get("PATHS.IMAGE.ADMIN.ACTUAL") + req.user.profilePic.split("/")[req.user.profilePic.split("/").length - 1],
      //     ]);
      // }
      return await universal.response(res, updatedAdmin.status, updatedAdmin.message, updatedAdmin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      await validations.admin.validateChangePassword(req.body);
      const updatedAdmin = await services.admin.Update(req.user._id, { oldPassword: req.body.oldPassword, password: req.body.newPassword });
      return await universal.response(res, updatedAdmin.status, messages.PASSWORD_RESET_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      await service.admin.Logout(mongoose.Types.ObjectId(req.user._id), { deviceToken: "", deviceType: "" });
      return await universal.response(res, codes.OK, messages.ADMIN_LOGOUT_SUCCESSFULLY, "", req.lang);
    } catch (error) {
      next(error);
    }
  },
  profile: async (req, res, next) => {
    try {
      let admin = await service.admin.Find({ _id: req.user._id });
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      await validations.admin.validateChangePassword(req, "body");
      let isMatch = await universal.comparePasswordUsingBcrypt(req.body.oldPassword, req.user.password);
      if (!isMatch) {
        return await universal.response(res, codes.BAD_REQUEST, messages.OLD_PASSWORD_IS_INCORRECT, "", req.lang);
      }
      let admin = await service.admin.Update(req.user._id, { password: req.body.newPassword }, true);
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      await validations.admin.validateForgotPassword(req, "body");
      let admin = await service.admin.Find({ email: req.body.email });
      if (admin.status == 200) {
        let otp = await service.otp.Create({ email: admin.data.email, phone: admin.data.phone, countryCode: admin.data.countryCode });
        // if (otp.status == 200) {
        //   await universal.emailService.sendEmail(admin.data.email, config.get("EMAIL_SERVICE").SUBJECTS.ADMIN_FORGOT_PASSWORD_OTP, otp.data.code);
        // }
        return await universal.response(res, otp.status, otp.message, otp.data, req.lang);
      }
      return await universal.response(res, admin.status, admin.message, admin.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verifyAndUpdatePassword: async (req, res, next) => {
    try {
      await validations.admin.validateNewPassword(req, "body");
      req.body.password = await universal.hashPasswordUsingBcrypt(req.body.password);
      let admin = await service.otp.FindAndUpdate({ code: req.body.otp, password: req.body.password });
      return await universal.response(res, admin.status, admin.message, "", req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  dashboard: async (req, res, next) => {
    try {
      let lastMonthstart = moment().subtract(1, "months").startOf("month");
      let lastMonthend = moment().subtract(1, "months").endOf("month");
      let lastYearstart = moment().subtract(1, "years").startOf("year");
      let lastYearend = moment().subtract(1, "years").endOf("year");
      let customers = (await service.customer.Find({})).data.length;
      let customersGoals = Number((customers / 500) * 100).toFixed(2);
      let last_month_customers = (await service.customer.Find({ createdAt: { $gte: lastMonthstart, $lte: lastMonthend } })).data.length;
      let this_month_customers = (await service.customer.Find({ createdAt: { $gte: moment().startOf("month"), $lte: moment().endOf("month") } })).data
        .length;
      let last_year_customers = (await service.customer.Find({ createdAt: { $gte: lastYearstart, $lte: lastYearend } })).data.length;
      let this_year_customers = (await service.customer.Find({ createdAt: { $gte: moment().startOf("year"), $lte: moment().endOf("year") } })).data
        .length;
      let total_customers_month_status = this_month_customers - last_month_customers;
      let total_customers_year_status = this_year_customers - last_year_customers;
      let drivers = (await service.driver.Find({})).data.length;
      let driverGoals = Number((drivers / 500) * 100).toFixed(2);
      let booking_requests = (await service.booking.Find({ status: { $in: [1, 2, 3] } })).data.length;
      let booking_requests_goals = Number((booking_requests / 500) * 100).toFixed(2);
      let total_bookings = (await service.booking.Find({})).data.length;
      let total_bookings_goals = Number((total_bookings / 500) * 100).toFixed(2);
      let last_month_total_bookings = (await service.booking.Find({ createdAt: { $gte: lastMonthstart, $lte: lastMonthend } })).data.length;
      let this_month_total_bookings = (await service.booking.Find({ createdAt: { $gte: moment().startOf("month"), $lte: moment().endOf("month") } }))
        .data.length;
      let last_year_total_bookings = (await service.booking.Find({ createdAt: { $gte: lastYearstart, $lte: lastYearend } })).data.length;
      let this_year_total_bookings = (await service.booking.Find({ createdAt: { $gte: moment().startOf("year"), $lte: moment().endOf("year") } }))
        .data.length;
      let total_bookings_month_status = this_month_total_bookings - last_month_total_bookings;
      let total_bookings_year_status = this_year_total_bookings - last_year_total_bookings;
      let dashboard_data = {
        customers: customers,
        customersGoals: Number(customersGoals),
        customersMonthStatus: total_customers_month_status,
        customersYearStatus: total_customers_year_status,
        driver: drivers,
        driverGoals: Number(driverGoals),
        booking_requests: booking_requests,
        booking_requests_goals: Number(booking_requests_goals),
        total_bookings: total_bookings,
        total_bookings_goals: Number(total_bookings_goals),
        total_bookings_month_status: total_bookings_month_status,
        total_bookings_year_status: total_bookings_year_status,
      };
      return await universal.response(res, codes.OK, messages.DASHBOARD_FETCHED_SUCCESSFULLY, dashboard_data, req.lang);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  analytics: async (req, res, next) => {
    try {
      let months = [
        { month: "01", name: "Jan" },
        { month: "02", name: "Fab" },
        { month: "03", name: "Mar" },
        { month: "04", name: "Apr" },
        { month: "05", name: "May" },
        { month: "06", name: "Jun" },
        { month: "07", name: "Jul" },
        { month: "08", name: "Aug" },
        { month: "09", name: "Sep" },
        { month: "10", name: "Oct" },
        { month: "11", name: "Nov" },
        { month: "12", name: "Dec" },
      ];
      let days = [
        { day: "Mo", name: "Mon" },
        { day: "Tu", name: "Tue" },
        { day: "We", name: "Wed" },
        { day: "Th", name: "Thu" },
        { day: "Fr", name: "Fri" },
        { day: "Sa", name: "Sat" },
        { day: "Su", name: "Sun" },
      ];
      let sumOn = 1;
      let dataToSend = [];
      // let order = []
      let pipeline = [];
      if (req.query.type == "MONTH") {
        pipeline.push(
          {
            $match: {
              $and: [
                {
                  createdAt: {
                    $gte: new Date(moment().startOf("year").format()),
                    $lte: new Date(moment().endOf("year").format()),
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%m", date: "$createdAt" } },
              month: {
                $first: {
                  $dateToString: { format: "%m", date: "$createdAt" },
                },
              },
              total: { $sum: sumOn },
            },
          }
        );
        let monthData;
        if (req.query.dataFor == "Customer") {
          monthData = await Model.Customer.aggregate(pipeline);
        } else if (req.query.dataFor == "Driver") {
          monthData = await Model.Driver.aggregate(pipeline);
        } else {
          monthData = await Model.Booking.aggregate(pipeline);
        }

        for (let i = 0; i < months.length; i++) {
          let obj = _.find(monthData, { month: months[i].month });
          if (obj) {
            dataToSend.push({
              name: months[i].name,
              total: obj.total,
            });
          } else {
            dataToSend.push({ name: months[i].name, total: 0 });
          }
        }
      }

      if (req.query.type == "WEEK") {
        pipeline = [
          //   { $match: { bookingStatus: } },
          {
            $match: {
              bookingLocalDate: {
                $gte: new Date(moment().startOf("week").add(1, "d")),
                $lte: new Date(moment().endOf("week").add(1, "d")),
              },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%d", date: "$createdAt" } },
              date: { $first: "$createdAt" },
              total: { $sum: sumOn },
            },
          },
        ];
        let weakData;
        if (req.query.dataFor == "Customer") {
          weakData = await Model.Customer.aggregate(pipeline);
        } else if (req.query.dataFor == "Driver") {
          weakData = await Model.Driver.aggregate(pipeline);
        } else {
          weakData = await Model.Booking.aggregate(pipeline);
        }

        for (let i = 0; i < days.length; i++) {
          let obj = _.find(weakData, { day: days[i].day });
          if (obj) {
            dataToSend.push({
              name: days[i].name,
              total: obj.total,
            });
          } else {
            dataToSend.push({ name: days[i].name, total: 0 });
          }
        }
      }
      console.log({ dataToSend });
      return await universal.response(res, codes.OK, messages.DATA_FETCHED_SUCCESSFULLY, dataToSend, req.lang);
      // return { status: true, data: dataToSend };
    } catch (error) {
      throw new Error(error);
    }
  },

  /*
    Fuelcategory
    */
  allCategory: async (req, res, next) => {
    try {
      // const category = await service.fuelCategory.Find({})
      // { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, facebookId: 0, deviceType: 0, deviceToken: 0, isBlocked: 0 }
      if (req.query.id) {
        const fuelCat = await services.fuelCategory.Find({ _id: mongoose.Types.ObjectId(req.query.id) });
        return await universal.response(res, fuelCat.status, fuelCat.message, fuelCat.data[0], req.lang);
      }
      let pipeline = [];
      pipeline.push(
        {
          $match: { isDeleted: false },
        },
        {
          $sort: { createdAt: -1 },
        }
      );

      let search = req.query.search;
      if (search && search.trim() != "") {
        search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let searchObj = {
          $match: {
            $or: [
              { _id: { $regex: search, $options: "i" } },
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { slug: { $regex: search, $options: "i" } },
            ],
          },
        };
        pipeline.push(searchObj);
      }
      pipeline.push({
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          isDeleted: 0,
          facebookId: 0,
          deviceType: 0,
          deviceToken: 0,
          isBlocked: 0,
        },
      });

      const category = await services.fuelCategory.FindWithPaginationcategories(pipeline, req.query.page ? Number(req.query.page) : 1);
      return await universal.response(res, category.status, category.message, category.data, req.lang);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  addFuelCategory: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.image = config.get("PATHS").IMAGE.FUEL_CATEGORY.STATIC + req.file.filename;
      }
      if (req.body.name) {
        req.body.slug = req.body.name;
      }
      await validations.admin.validateAddFuelCategory(req, "body");
      let category = await service.fuelCategory.Create(req.body);
      return await universal.response(res, category.status, category.message, category.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.FUEL_CATEGORY.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  updateFuelcategory: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.image = config.get("PATHS").IMAGE.FUEL_CATEGORY.STATIC + req.file.filename;
      }
      await validations.admin.validateUpdateFuelCategory(req, "body");
      let category = await service.fuelCategory.Update(req.query.id, req.body);
      return await universal.response(res, category.status, category.message, category.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.FUEL_CATEGORY.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  deleteFuelcategory: async (req, res, next) => {
    try {
      let category = await service.fuelCategory.Update(req.query.id, { isDeleted: true });
      return await universal.response(res, category.status, messages.FUEL_CATEGORY_DELETED_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    FuelProduct 
    */
  addFuelProduct: async (req, res, next) => {
    try {
      await validations.admin.validateAddFuelProduct(req, "body");
      let product = await service.fuelProduct.Create(req.body);
      return await universal.response(res, product.status, product.message, product.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteFuelProduct: async (req, res, next) => {
    try {
      let product = await service.fuelProduct.Update(req.query.id, { isDeleted: true });
      return await universal.response(res, product.status, messages.FUEL_PRODUCTS_DELETED_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    Manage Bookings
    */
  getBookings: async (req, res, next) => {
    try {
      if (req.query.id) {
        let booking = await service.booking.FindWithAggregate({ _id: mongoose.Types.ObjectId(req.query.id) });
        return await universal.response(res, booking.status, booking.message, booking.data[0], req.lang);
      } else {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const skip = page - 1 <= 0 ? 0 : (page - 1) * 10;
        if (req.query.type == "new") {
          let newBooking = await service.booking.FindWithAggregateWithLimit({ status: 0 }, skip);
          return await universal.response(res, newBooking.status, newBooking.message, newBooking.data, req.lang);
        }
        if (req.query.type == "pending") {
          let pendingBookings = await service.booking.FindWithAggregateWithLimit({ status: { $in: [1 || 2 || 3 || 4] } }, skip);
          return await universal.response(res, pendingBookings.status, pendingBookings.message, pendingBookings.data, req.lang);
        }
        if (req.query.type == "cancel") {
          let cancelBooking = await service.booking.FindWithAggregateWithLimit({ status: 6 }, skip);
          return await universal.response(res, cancelBooking.status, cancelBooking.message, cancelBooking.data, req.lang);
        }
        if (req.query.type == "completed") {
          let completedBooking = await service.booking.FindWithAggregateWithLimit({ status: 5 }, skip);
          return await universal.response(res, completedBooking.status, completedBooking.message, completedBooking.data, req.lang);
        }
        let search;
        if (req.query.search) {
          search = req.query.search;
        } else if (req.query.status) {
          search = Number(req.query.status);
        }
        console.log(search, typeof search);
        let bookings = await service.booking.FindWithAggregateWithLimit({}, skip, search);
        return await universal.response(res, bookings.status, bookings.message, bookings.data, req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getPendingBookings: async (req, res, next) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const skip = page - 1 <= 0 ? 0 : (page - 1) * 10;
      let bookings = await service.booking.FindWithAggregateWithLimit({}, skip);
      return await universal.response(res, bookings.status, bookings.message, bookings.data, req.lang);
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },
  editBooking: async (req, res, next) => {
    try {
      let booking = await service.booking.Find({ _id: mongoose.Types.ObjectId(req.query.id) });
      if (booking.data.length == 1) {
        booking = await service.booking.Update(booking.data[0]._id, req.body);
        return await universal.response(res, booking.status, booking.message, booking.data, req.lang);
      }
      return await universal.response(res, booking.status, booking.message, booking.data[0], req.lang);
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },
  updateBooking: async (req, res, next) => {
    try {
      if (req.params.type == "accept") {
        let booking = await service.booking.Update(req.body.bookingId, { status: 1, acceptedAt: Date.now() });
        let customerId = booking.data.customer;
        booking = await service.booking.FindWithAggregate({ _id: req.body.bookingId });
        let sendBooking = await service.booking.FindAndLookup({ _id: req.body.bookingId });
        Socket.emitToRoom(customerId, "receiveBooking", sendBooking.data.bookings[0]);
        let customer = await service.customer.FindWithPassword({ _id: customerId });
        fcm.pushNotification(customer.data.deviceType, customer.data.deviceToken, "Accepted", `Booking has been Accepted`, sendBooking.data.bookings[0]);
        await service.notification.Create({
          userId: customerId,
          title: "Booking Accepted",
          body: `Booking Accepted`,
          message: JSON.stringify(sendBooking.data.bookings[0]),
          image: "done.svg",
        });
        return await universal.response(res, codes.OK, booking.message, booking.data[0], req.lang);
      } else if (req.params.type == "loaded") {
        let booking = await service.booking.Update(req.body.bookingId, { status: 2, vehicle: req.body.vehicleId, loadedAt: Date.now() });
        let customerId = booking.data.customer;
        booking = await service.booking.FindWithAggregate({ _id: req.body.bookingId });
        let sendBooking = await service.booking.FindAndLookup({ _id: req.body.bookingId });
        Socket.emitToRoom(customerId, "receiveBooking", sendBooking.data.bookings[0]);
        let customer = await service.customer.FindWithPassword({ _id: customerId });
        fcm.pushNotification(customer.data.deviceType, customer.data.deviceToken, "Loaded", `Booking has been Loaded`, sendBooking.data.bookings[0]);
        await service.notification.Create({
          userId: customerId,
          title: "Booking Loaded",
          body: `Booking Loaded`,
          message: JSON.stringify(sendBooking.data.bookings[0]),
          image: "done.svg",
        });
        return await universal.response(res, codes.OK, booking.message, booking.data[0], req.lang);
      } else if (req.params.type == "dispatched") {
        const _driver = await models.Driver.findOne({ _id: mongoose.Types.ObjectId(req.body.driverId), profileStatus: 2 });
        if (!_driver) {
          throw new Error("Driver Profile is not completed, select another driver !");
        }
        let booking = await service.booking.Update(req.body.bookingId, { status: 3, driver: req.body.driverId, dispatchedAt: Date.now() });
        let customerId = booking.data.customer;
        let driverId = req.body.driverId;
        booking = await service.booking.FindWithAggregate({ _id: req.body.bookingId });
        let sendBooking = await service.booking.FindAndLookup({ _id: req.body.bookingId });
        Socket.emitToRoom(customerId, "receiveBooking", sendBooking.data.bookings[0]);
        let customer = await service.customer.FindWithPassword({ _id: customerId });
        fcm.pushNotification(customer.data.deviceType, customer.data.deviceToken, "Dispatched", `Booking has been Dispatched`, sendBooking.data.bookings[0]);
        await service.notification.Create({
          userId: customerId,
          title: "Booking Dispatched",
          body: `Booking Dispatched`,
          message: JSON.stringify(sendBooking.data.bookings[0]),
          image: "done.svg",
        });
        Socket.emitToRoom(driverId, "receiveBooking", booking.data[0]);
        let driver = await service.driver.FindWithPassword({ _id: driverId });
        fcm.pushNotification(driver.data.deviceType, driver.data.deviceToken, "Booking Assigned", `Booking has been Assigned`, booking.data[0]);
        await service.notification.Create({
          userId: driverId,
          title: "Booking Assigned",
          body: `Booking Assigned`,
          message: JSON.stringify(booking.data[0]),
          image: "done.svg",
        });
        return await universal.response(res, codes.OK, booking.message, booking.data[0], req.lang);
      } else if (req.params.type == "reject") {
        let booking = await service.booking.Update(req.body.bookingId, { status: 6 });
        console.log("UPDATE WORKED");
        let customerId = booking.data.customer;
        console.log("CUSTOMER ID", customerId);
        booking = await service.booking.FindWithAggregate({ _id: req.body.bookingId });
        let sendBooking = await service.booking.FindAndLookup({ _id: req.body.bookingId });
        Socket.emitToRoom(customerId, "receiveBooking", sendBooking.data.bookings[0]);
        let customer = await service.customer.FindWithPassword({ _id: customerId });
        fcm.pushNotification(
          customer.data.deviceType,
          customer.data.deviceToken,
          "Booking Rejected",
          `Booking has been Rejected`,
          sendBooking.data.bookings[0]
        );
        console.log("PUSH NOTIFICATION CREATED");
        await service.notification.Create({
          userId: customerId,
          title: "Booking Rejected",
          body: `Booking Rejected`,
          message: JSON.stringify(sendBooking.data.bookings[0]),
          image: "cancel.svg",
        });
        console.log("NOTIFICATION ADDED TO MODEL");
        return await universal.response(res, codes.OK, booking.message, booking.data[0], req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteBooking: async (req, res, next) => {
    try {
      const { id } = req.query;
      let booking = await service.booking.Find({ _id: mongoose.Types.ObjectId(id) });
      if (booking.data.length == 1) {
        if (booking.data[0].status == 5) {
          booking = await service.booking.Update(booking.data[0]._id, { isDeleted: true });
          return await universal.response(res, booking.status, messages.BOOKING_DELETED_SUCCESSFULLY, {}, req.lang);
        } else {
          return await universal.response(res, codes.BAD_REQUEST, messages.BOOKING_NOT_DELIVERED, {}, req.lang);
        }
      } else {
        return await universal.response(res, codes.BAD_REQUEST, messages.BOOKING_NOT_EXIST, {}, req.lang);
      }
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },

  /*
    Manage Drivers
    */
  getDrivers: async (req, res, next) => {
    try {
      if (req.query.id) {
        let driver = await service.driver.Find({ _id: mongoose.Types.ObjectId(req.query.id) });
        return await universal.response(res, driver.status, driver.message, driver.data[0], req.lang);
      } else {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const skip = page - 1 <= 0 ? 0 : (page - 1) * 10;
        let drivers = await service.driver.FindWithLimit({}, skip);
        for (const x in drivers.data.driver) {
          let driver = drivers.data.driver[x];
          let data = (await services.booking.Find({ driver: driver._id })).data;
          driver.totalBookings = data.length;
          let amounts = data.map((booking) => booking.amount);
          driver.totalPayment = await amounts.reduce((a, b) => a + b, 0);
          driver.totalPayment = driver.totalPayment.toFixed(2);
          drivers.data.driver[x] = {
            _id: driver._id,
            profileStatus: driver.profileStatus,
            firstName: driver.firstName,
            lastName: driver.lastName,
            phone: driver.phone,
            countryCode: driver.countryCode,
            address: driver.address,
            isBlocked: driver.isBlocked,
            residentalAddress: driver.residentalAddress,
            totalPayment: driver.totalPayment,
            email: driver.email,
            status: driver.status,
            totalBookings: driver.totalBookings,
          };
        }
        if (req.query.search) {
          let searchPipeline = [];
          let search = req.query.search;
          if (search && search.trim() != "") {
            search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            let searchObj = {
              $match: {
                $or: [
                  { firstName: { $regex: search, $options: "i" } },
                  { lastName: { $regex: search, $options: "i" } },
                  { phone: { $regex: search, $options: "i" } },
                  { address: { $regex: search, $options: "i" } },
                  { residentalAddress: { $regex: search, $options: "i" } },
                ],
              },
            };
            searchPipeline.push(searchObj);
            searchPipeline.push({
              $project: {
                deviceType: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                long: 0,
                lat: 0,
                accountNumber: 0,
                accountName: 0,
                accountType: 0,
                bankName: 0,
                ifsc: 0,
                bio: 0,
                documents: 0,
                password: 0,
                isDeleted: 0,
                isBlocked: 0,
                deviceToken: 0,
                countryCode: 0,
                isEmailVerify: 0,
                isPhoneVerify: 0,
              },
            });
            const data = await models.Driver.aggregate(searchPipeline);

            return await universal.response(res, codes.OK, messages.DRIVERS_FETCHED_SUCCESSFULLY, data, req.lang);
          }
        }
        return await universal.response(res, drivers.status, drivers.message, drivers.data, req.lang);
      }
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },

  driversCSV: async (req, res, next) => {
    try {
      if (!req.query.auth) throw new Error("No Auth");
      if (req.query.auth) {
        const accessToken = req.query.auth;
        const decodeData = await universal.jwtVerify(accessToken);
        if (!decodeData) throw new Error("Invalid Auth");
        const userData = await Model.Admin.findOne({ _id: decodeData._id }).lean().exec();
        if (!userData) return universal.response(res, Codes.BAD_REQUEST, Messages.ADMIN_NOT_EXIST, "", req.lang);
        let drivers = await service.driver.Find({});
        for (const x in drivers.data) {
          drivers.data[x] = {
            _id: drivers.data[x]._id,
            profileStatus: drivers.data[x].profileStatus,
            firstName: drivers.data[x].firstName,
            lastName: drivers.data[x].lastName,
            phone: drivers.data[x].phone,
            countryCode: drivers.data[x].countryCode,
            address: drivers.data[x].address,
            isBlocked: drivers.data[x].isBlocked,
            residentalAddress: drivers.data[x].residentalAddress,
            email: drivers.data[x].email,
          };
        }
        const fields = [
          "_id",
          "profileStatus",
          "firstName",
          "lastName",
          "phone",
          "countryCode",
          "address",
          "isBlocked",
          "residentalAddress",
          "email",
        ];
        const worker = new Parser({ fields });
        const csv = worker.parse(drivers.data);
        let paths = path.resolve(__dirname, "../../uploads/files/driver/" + "driver.csv");
        fs.writeFileSync(paths, csv);
        res.header("Content-Type", "text/csv");
        return res.download(paths, "driver.csv");
      }
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },
  customerCSV: async (req, res, next) => {
    try {
      if (!req.query.auth) throw new Error("No Auth");
      if (req.query.auth) {
        const accessToken = req.query.auth;
        const decodeData = await universal.jwtVerify(accessToken);
        if (!decodeData) throw new Error("Invalid Auth");
        const userData = await Model.Admin.findOne({ _id: decodeData._id }).lean().exec();
        if (!userData) return universal.response(res, Codes.BAD_REQUEST, Messages.ADMIN_NOT_EXIST, "", req.lang);
        let customers = await service.customer.Find({});
        for (const x in customers.data) {
          customers.data[x] = {
            _id: customers.data[x]._id,
            firstName: customers.data[x].firstName,
            lastName: customers.data[x].lastName,
            email: customers.data[x].email,
            countryCode: customers.data[x].countryCode,
            phone: customers.data[x].phone,
            address: customers.data[x].address,
            profileStatus: customers.data[x].profileStatus,
            isBlocked: customers.data[x].isBlocked,
          };
        }
        const fields = ["_id", "firstName", "lastName", "email", "countryCode", "phone", "address", "profileStatus", "isBlocked"];
        const worker = new Parser({ fields });
        const csv = worker.parse(customers.data);
        let paths = path.resolve(__dirname, "../../uploads/files/customer/" + "customer.csv");
        fs.writeFileSync(paths, csv);
        res.header("Content-Type", "text/csv");
        return res.download(paths, "customer.csv");
      }
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },

  getDriverBookings: async (req, res, next) => {
    try {
      let bookings = await services.booking.Find({ driver: req.query.id });
      return await universal.response(res, bookings.status, bookings.message, bookings.data, req.lang);
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  },
  updateDriver: async (req, res, next) => {
    try {
      if (req.query.id) {
        console.log({ message: "Update" });
        // -> Update Existing Driver
        await validations.admin.updateDriverValidation(req, "body");
        if (req.file) {
          req.body.profilePic = config.get("PATHS").IMAGE.DRIVER.STATIC + req.file.filename;
        }
        if (req.files) req.body.documents = await req.files.map((image) => config.get("PATHS").FILE.DRIVER.STATIC + image.filename);
        const { id } = req.query;
        let driver = await service.driver.Find({ _id: mongoose.Types.ObjectId(id) });
        if (driver.data.length == 1) {
          driver = await service.driver.Update(driver.data[0]._id, req.body);
          return await universal.response(res, driver.status, driver.message, driver.data, req.lang);
        } else {
          return await universal.response(res, codes.BAD_REQUEST, messages.DRIVER_NOT_EXIST, {}, req.lang);
        }
      } else {
        console.log({ message: "Create" });
        // -> Create a New Driver
        await validations.admin.addDriverValidation(req, "body");
        let driver = await services.driver.Create(req.body);
        return await universal.response(res, driver.status, driver.message, driver.data, req.lang);
      }
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.DRIVER.ACTUAL + req.file.filename]);
      if (req.files) {
        let paths = await req.files.map((image) => config.get("PATHS").FILE.DRIVER.ACTUAL + image.filename);
        await universal.deleteFiles(paths);
      }
      console.log(error);
      next(error);
    }
  },
  deleteDriver: async (req, res, next) => {
    try {
      const { id } = req.query;
      let driver = await service.driver.Find({ _id: mongoose.Types.ObjectId(id) });
      if (driver.data.length == 1) {
        driver = await service.driver.Update(driver.data[0]._id, { isDeleted: true });
        return await universal.response(res, driver.status, messages.DRIVER_DELETED_SUCCESSFULLY, {}, req.lang);
      } else {
        return await universal.response(res, codes.BAD_REQUEST, messages.DRIVER_NOT_EXIST, {}, req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    Manage Customers
    */
  getCustomers: async (req, res, next) => {
    try {
      if (req.query.id) {
        let customer = await service.customer.Find({ _id: mongoose.Types.ObjectId(req.query.id) });
        return await universal.response(res, customer.status, customer.message, customer.data[0], req.lang);
      } else {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const skip = page - 1 <= 0 ? 0 : (page - 1) * 10;
        let customers = await service.customer.FindWithLimit({}, skip);
        for (const x in customers.data.customers) {
          let customer = customers.data.customers[x];
          let data = (await services.booking.Find({ customer: customer._id }, { _id: 0 })).data;
          customer.lastBookingAt = data.length > 0 ? data[0].createdAt || "" : "";
          customer.totalBookings = data.length;
          let amounts = data.map((booking) => booking.amount);
          customer.totalPayment = await amounts.reduce((a, b) => a + b, 0);
          customer.totalPayment = customer.totalPayment.toFixed(2);
          customers.data.customers[x] = {
            _id: customer._id,
            profileStatus: customer.profileStatus,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            countryCode: customer.countryCode,
            address: customer.address,
            isBlocked: customer.isBlocked,
            totalPayment: customer.totalPayment,
            calcelledBookings: (await models.Booking.find({ status: 6, customer: mongoose.Types.ObjectId(customer._id) })).length,
            lastBookingAt: customer.lastBookingAt,
            email: customer.email,
            totalBookings: customer.totalBookings,
          };
          if (req.query.search) {
            let searchPipeline = [];
            let search = req.query.search;
            if (search && search.trim() != "") {
              search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              searchPipeline.push({
                $addFields: {
                  fullName: {
                    $concat: ["$firstName", " ", "$lastName"],
                  },
                },
              });
              let searchObj = {
                $match: {
                  $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { profileStatus: req.query.search.toUpperCase() },
                    { phone: { $regex: search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                    { address: { $regex: search, $options: "i" } },
                  ],
                },
              };
              searchPipeline.push(searchObj);
              searchPipeline.push({
                $project: {
                  deviceType: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  __v: 0,
                  long: 0,
                  lat: 0,
                  accountNumber: 0,
                  accountName: 0,
                  accountType: 0,
                  bankName: 0,
                  ifsc: 0,
                  bio: 0,
                  documents: 0,
                  password: 0,
                  isDeleted: 0,
                  isBlocked: 0,
                  deviceToken: 0,
                  countryCode: 0,
                  isEmailVerify: 0,
                  isPhoneVerify: 0,
                },
              });
              const data = await models.Customer.aggregate(searchPipeline);
              // Added
              for (let x in data) {
                console.log({ x: data[x] });
                const customer = data[x];
                customer.calcelledBookings = await models.Booking.find({
                  status: 6,
                  customer: mongoose.Types.ObjectId(customer._id),
                }).countDocuments();
                customer.totalBookings = await models.Booking.find({ customer: mongoose.Types.ObjectId(customer._id) }).countDocuments();
                let totalPayment = await models.Booking.find({ customer: mongoose.Types.ObjectId(customer._id) });
                totalPayment = totalPayment.map((_booking) => _booking.amount);
                console.log({ totalPayment });
                customer.totalPayment = totalPayment.reduce((a, b) => a + b, 0);
                customer.totalPayment = customer.totalPayment.toFixed(2);
              }
              return await universal.response(res, codes.OK, messages.CUSTOMERS_FETCHED_SUCCESSFULLY, data, req.lang);
            }
          }
        }
        return await universal.response(res, customers.status, customers.message, customers.data, req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getCustomerBookings: async (req, res, next) => {
    try {
      await validations.admin.customerBookingValidation(req, "query");
      let project = {
        deliveryAddress: 0,
        product: 0,
        "customer.deviceToken": 0,
        "customer.deviceType": 0,
        "customer.createdAt": 0,
        "customer.updatedAt": 0,
        "customer.__v": 0,
        "customer.long": 0,
        "customer.lat": 0,
        "customer.isEmailVerify": 0,
        "customer.isPhoneVerify": 0,
        "customer.password": 0,
        "customer.phone": 0,
        "customer.countryCode": 0,
        "customer.address": 0,
      };
      // (findObj,search=null,page=1,limit=10,projection = null)
      console.log({ searchController: req.query.search });
      let bookings = await services.booking.FindWithPagination(
        { customer: mongoose.Types.ObjectId(req.query.customerId) },
        req.query.search ? req.query.search : null,
        req.query.page,
        10,
        project
      );
      return await universal.response(res, bookings.status, bookings.message, bookings.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateCustomer: async (req, res, next) => {
    try {
      if (req.query.id) {
        const { id } = req.query;
        let customer = await service.customer.Find({ _id: mongoose.Types.ObjectId(id) });
        const data = customer.data[0];
        if (req.file) req.body.profilePic = config.get("PATHS").IMAGE.CUSTOMER.STATIC + req.file.filename;
        const user = await service.customer.Update(data._id, req.body);
        return await universal.response(res, user.status, user.message, user.data, req.lang);
      } else {
        await validations.admin.addCustomerValidation(req, "body");
        let customer = await services.customer.Create(req.body);
        return await universal.response(res, customer.status, customer.message, customer.data, req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteCustomer: async (req, res, next) => {
    try {
      const { id } = req.query;
      let customer = await service.customer.Find({ _id: mongoose.Types.ObjectId(id) });
      if (customer.data.length == 0) return await universal.response(res, customer.status, customer.message, {}, req.lang);
      const user = await service.customer.Update(customer.data[0]._id, { isDeleted: true });
      return await universal.response(res, user.status, messages.CUSTOMER_DELETED_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /*
    Manage Vehicle
    */
  getVehicle: async (req, res, next) => {
    if (req.query.id) {
      let vehicle = await service.vehicle.Find({ _id: mongoose.Types.ObjectId(req.query.id) });
      console.log({ vehicle });
      return await universal.response(res, vehicle.status, vehicle.message, vehicle.data[0], req.lang);
    }
    try {
      console.log({ search: req.query.search });
      let pipeline = [
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: { isDeleted: false },
        },
      ];

      pipeline.push(
        {
          $lookup: {
            from: "vehiclecategories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        }
      );

      if (req.query.search && req.query.search.trim() != "") {
        let height;
        let width;
        if (req.query.search.includes("*")) {
          console.log({ split: req.query.search.split("*") });
          const split = req.query.search.split("*");
          height = Number(split[0]);
          width = Number(split[1]);
        }
        req.query.search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let searchObj = {
          $match: {
            $or: [
              { _id: { $regex: req.query.search, $options: "i" } },
              { category: { $regex: req.query.search, $options: "i" } },
              { createdAt: { $regex: req.query.search, $options: "i" } },
              { capacity: Number(req.query.search) },
              { "dimension.height": height },
              { "dimension.width": width },
            ],
          },
        };
        pipeline.push(searchObj);
      }
      pipeline.push({
        $project: { __v: 0, isDeleted: 0 },
      });

      let vehicle = await service.vehicle.FindWithPagination(pipeline, req.query.page ? Number(req.query.page) : 1);
      // let vehicle = await service.vehicle.Find(req.body)
      return await universal.response(res, vehicle.status, vehicle.message, vehicle.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addVehicle: async (req, res, next) => {
    try {
      await validations.admin.addVehicleValidation(req, "body");
      let vehicle = await service.vehicle.Create(req.body);
      return await universal.response(res, vehicle.status, vehicle.message, vehicle.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateVehicle: async (req, res, next) => {
    try {
      await validations.admin.updateVehicleValidation(req, "body");
      let vehicle = await service.vehicle.Update(req.query.id, req.body);
      return await universal.response(res, vehicle.status, vehicle.message, vehicle.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteVehicle: async (req, res, next) => {
    try {
      let vehicle = await service.vehicle.Update(req.query.id, { isDeleted: true });
      return await universal.response(res, vehicle.status, messages.DELETE_VEHICLE_SUCCESSFULLY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  /*
    Manage Vehicle Categories
    */
  addVechileCategory: async (req, res, next) => {
    try {
      await validations.admin.vechileCategoryValidation(req, "body");
      let vehicleCategory = await service.vehicleCategory.Create(req.body);
      return await universal.response(res, vehicleCategory.status, vehicleCategory.message, vehicleCategory.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getVehicleCategory: async (req, res, next) => {
    try {
      if (req.query.id) {
        let vehicleCategory = await service.vehicleCategory.Find({ _id: mongoose.Types.ObjectId(req.query.id) });
        console.log({ vehicleCategory });
        return await universal.response(res, vehicleCategory.status, vehicleCategory.message, vehicleCategory.data[0], req.lang);
      }
      console.log({ search: req.query.search });
      let pipeline = [
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: { isDeleted: false },
        },
      ];

      if (req.query.search && req.query.search.trim() != "") {
        req.query.search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let searchObj = {
          $match: {
            $or: [
              { _id: { $regex: req.query.search, $options: "i" } },
              { capacity: { $regex: req.query.search, $options: "i" } },
              { createdAt: { $regex: req.query.search, $options: "i" } },
            ],
          },
        };
        pipeline.push(searchObj);
        pipeline.push({
          $project: { __v: 0 },
        });
      }

      let vehicleCategory = await service.vehicleCategory.FindWithPagination(pipeline, req.query.page);
      return await universal.response(res, vehicleCategory.status, vehicleCategory.message, vehicleCategory.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateVechileCategory: async (req, res, next) => {
    try {
      await validations.admin.vechileCategoryValidation(req, "body");
      let vehicleCategory = await service.vehicleCategory.Update(req.query.id, req.body);
      return await universal.response(res, vehicleCategory.status, vehicleCategory.message, vehicleCategory.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteVechileCategory: async (req, res, next) => {
    try {
      let vehicleCategory = await service.vehicleCategory.Update(req.query.id, { isDeleted: true });
      return await universal.response(res, vehicleCategory.status, messages.DELETE_VEHICLE_CATAGORY, {}, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getDropdowns: async (req, res, next) => {
    try {
      if (req.params.type == "drivers") {
        let driver = await service.driver.Find({});
        for (const x in driver.data) {
          driver.data[x] = { _id: driver.data[x]._id, name: driver.data[x].firstName + " " + driver.data[x].lastName };
        }
        return await universal.response(res, driver.status, driver.message, driver.data, req.lang);
      } else if (req.params.type == "vehicles") {
        let vehicles = await service.vehicle.Find({});
        for (const x in vehicles.data) {
          vehicles.data[x] = { _id: vehicles.data[x]._id, capacity: vehicles.data[x].capacity };
        }
        return await universal.response(res, vehicles.status, vehicles.message, vehicles.data, req.lang);
      } else if (req.params.type == "vehiclesCategories") {
        let vehicleCategory = await service.vehicleCategory.Find({});
        return await universal.response(res, vehicleCategory.status, vehicleCategory.message, vehicleCategory.data, req.lang);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  /**
   * Promos
   */

  addPromo: async (req, res, next) => {
    try {
      await validations.admin.promoValidation(req, "body");
      const newPromo = await services.promo.Create({ ...req.body, admin: req.user._id });
      return await universal.response(res, newPromo.status, newPromo.message, newPromo.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getAllPromo: async (req, res, next) => {
    try {
      const allPromos = await services.promo.Find();
      return await universal.response(res, allPromos.status, allPromos.message, allPromos.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getSlot: async (req, res, next) => {
    try {
      if (req.query.day) {
        let slot = await models.Slots.find({ day: req.query.day });
        return await universal.response(res, codes.OK, messages.SLOT_FETCHED_SUCCESSFULLY, slot[0], req.lang);
      }
      slot = await models.Slots.find({});
      return universal.response(res, codes.OK, messages.SLOT_FETCHED_SUCCESSFULLY, slot, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateSlot: async (req, res, next) => {
    try {
      const { day } = req.params;
      if (!day) return universal.errMessage(res, codes.BAD_REQUEST, messages.DAY_REQ, req.lang);
      // if (req.body.day) throw new Error("day is not allowed !");
      validations.admin.updteSlotValidation(req.body);
      slot = await models.Slots.findOneAndUpdate({ day: day.toLowerCase() }, { $set: req.body }, { new: true });
      return universal.response(res, codes.OK, messages.SLOT_UPDATED, slot, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
