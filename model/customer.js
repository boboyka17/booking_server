const { mongoose } = require("mongoose");

const customerSchema = new mongoose.Schema({
  idCard: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
  },
  FirstNameN: {
    type: String,
  },
  LastName: {
    type: String,
  },
  LastNameN: {
    type: String,
  },
  Gender: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("customer", customerSchema);
