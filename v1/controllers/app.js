const config = require("config");
const universal = require("../../utils");
const models = require("../../models");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  /*
  App CRUDs
  */
  create: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.icon = config.get("PATHS").IMAGE.APP.STATIC + req.file.filename;
      }
      let app = await models.App(req.body).save();
      app = {
        status: 200,
        message: "APP_CREATED_SUCCESSFULLY",
        data: app
      }
      return await universal.response(res, app.status, app.message, app.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.APP.ACTUAL + req.file.filename]);
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      let apps = await models.app.find({ isDeleted: false }).lean();
      apps = {
        status: 200,
        message: "APPS_FETCHED_SUCCESSFULLY",
        data: apps
      }
      return await universal.response(res, apps.status, apps.message, apps.data, req.lang);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      let app = await models.appCategory.findOne({ _id: ObjectId(req.params.id), isDeleted: false }).lean();
      app = {
        status: 200,
        message: "APP_FETCHED_SUCCESSFULLY",
        data: app
      }
      return await universal.response(res, app.status, app.message, app.data, req.lang);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.icon = config.get("PATHS").IMAGE.APP.STATIC + req.file.filename;
      }
      let app = await models.App.findOne({ _id: ObjectId(req.params.id), isDeleted: false }).lean();
      if (!app) return await universal.response(res, 400, "APP_NOT_EXIST", {}, req.lang);
      await models.App.updateOne({ _id: ObjectId(req.params.id), isDeleted: false }, req.body, { new: true }).lean();
      app = await models.App.findOne({ _id: ObjectId(req.params.id), isDeleted: false }).lean();
      app = {
        status: 200,
        message: "APP_UPDATED_SUCCESSFULLY",
        data: app
      }
      return await universal.response(res, app.status, app.message, app.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.APP.ACTUAL + req.file.filename]);
      next(error);
    }
  },
};
