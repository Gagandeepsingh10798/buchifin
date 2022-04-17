const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
  },
  transactionId: {
    type: String,
  },
  transactionDate: {
    type: Date,
  },
  transactionAmount: {
    type: Number,
    default: 0,
  },
  isCredit: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("wallet", transactionSchema);
