const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    
    day: String,
    st: String,
    et: String,
    isClosed: Boolean

},{
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model("slots", slotSchema);

