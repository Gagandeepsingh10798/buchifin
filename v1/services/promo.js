const mongoose = require("mongoose");
const Model = require("../../models"),
  messages = require("../../constants").Messages,
  codes = require("../../constants").Codes;

const PROJECTION = {
  FIND: { createdAt: 0, updatedAt: 0, admin: 0 },
};
const Create = async (createobj) => {
  try {
    let newPromo = await Model.Promo.create({ ...createobj });
    newPromo = await Model.Promo.findById(newPromo.id, PROJECTION.FIND);
    return { status: codes.OK, message: messages.PROMO_CODE_ADDED_SUCCESSFULLY, data: newPromo };
  } catch (error) {
    throw new Error(error);
  }
};

const Find = async (findobj, projection = null) => {
  try {
    // if (findobj._id) mongoose.Types.ObjectId(findObj._id);
    let allPromos = await Model.Promo.find({}, projection ? projection : { ...PROJECTION.FIND })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return { status: codes.OK, message: messages.PROMOS_FETCHED_SUCCESSFULLY, data: allPromos };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  Find,
  Create,
};
