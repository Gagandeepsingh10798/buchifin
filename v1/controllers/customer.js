const models = require("../../models");

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
