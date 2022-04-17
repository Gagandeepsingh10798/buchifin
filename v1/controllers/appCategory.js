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
        req.body.icon = config.get("PATHS").IMAGE.APP_CATEGORY.STATIC + req.file.filename;
      }
      let category = await models.appCategory(req.body).save();
      category = {
        status: 200,
        message: "APP_CREATED_SUCCESSFULLY",
        data: category
      }
      return await universal.response(res, category.status, category.message, category.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.APP_CATEGORY.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      let categories = await models.appCategory.find({ isDeleted: false }).lean();
      categories = {
        status: 200,
        message: "APPS_FETCHED_SUCCESSFULLY",
        data: categories
      }
      return await universal.response(res, categories.status, categories.message, categories.data, req.lang);
    } catch (error) {
      if (req.file) await universal.deleteFiles([config.get("PATHS").IMAGE.APP_CATEGORY.ACTUAL + req.file.filename]);
      console.log(error);
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      let app = await models.appCategory.findOne({ _id: ObjectId(req.params.id) }).lean();
      app = {
        status: 200,
        message: "APP_FETCHED_SUCCESSFULLY",
        data: app
      }
      return await universal.response(res, app.status, app.message, app.data, req.lang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
