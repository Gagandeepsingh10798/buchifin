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
  Request API
  */
  request: async (req, res, next) => {
    try {
      let request = await models.Request(req.body).save();
      request = {
        status: 200,
        message: "REQUEST_SENT_SUCCESSFULLY",
        data: request
      }
      return await universal.response(res, request.status, request.message, request.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
