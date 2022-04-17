const Model = require("../../models");
const codes = require('../../constants').Codes
const messages = require('../../constants').Messages

let PROJECTION = {
    CREATE: { __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0, id: 0,__enc_cardNumber:0 , __enc_expireDate:0,},
}


const Create = async (createObj) => {
    try {
        let card = await Model.Cards(createObj).save()
        card = await Model.Cards.findById(card._id).exec(); //find works transparently and you can make new documents as normal, but you should not use the **lean option** on a find ,findById, findOne or save if you want the fields of the document to be decrypted.
        return { status: codes.OK, message: messages.CARD_SAVED_SUCCESSFULLY, data: card }
    }
    catch (error) {
        throw new Error(error)
    }
};
const Find = async (findObj) => {
    try {
        findObj = {...findObj, isDeleted: false}
        let cards = await Model.Cards.find(findObj)
        return { status: codes.OK, message: messages.CARDS_FETCHED_SUCCESSFULLY, data: cards }
    }
    catch (error) {
        throw new Error(error)
    }
};
const FindAndUpdate = async (findObj, updateObj) => {
    try {
        let cards = await Model.Cards.findOneAndUpdate(findObj, updateObj , {
            new: true
        });//update works only for string fields and you would also need to manually set the __enc_ field value to false if you're updating an encrypted field.
        return { status: codes.OK, message: messages.CARDS_UPDATED_SUCCESSFULLY, data: cards }
    }
    catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    Create,
    Find,
    FindAndUpdate
}