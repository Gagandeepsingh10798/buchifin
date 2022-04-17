const mongoose = require("mongoose");
const Model = require("../../models");
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages

const PROJECTION = { _id: 1, firstName: 1, lastName: 1,walletBalance: 1}
const Update = async(customer,amount) => {
    try {
        const updatedWallet = await Model.Customer.findByIdAndUpdate({_id: mongoose.Types.ObjectId(customer._id)}, {$inc: {walletBalance: amount}}, {
            fields: PROJECTION,
            new: true
        }).lean().exec();
        return { status: codes.OK, message: messages.SUCCESSFULLY_ADDED_TO_WALLET, data: updatedWallet };
    } catch (error) {
        console.log(error);
    next(error);
    }
};

const Find = async(findObj) => {
    try {
        if (findObj.id)  mongoose.Types.ObjectId(findObj.id);
        const transactions = await Model.Transaction.find(findObj).lean().exec();
        return { status: codes.OK, message: transactions.length == 0 ? messages.NO_TRANSACTIONS_TILL_NOW : messages.TRANSACTIONS_FETCHED_SUCCESSFULLY, data: transactions };
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    Update,
    Find
}