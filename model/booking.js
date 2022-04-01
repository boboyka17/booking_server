const { mongoose } = require("mongoose");

const bookingSchema = new mongoose.Schema({
  dateTitle: {
    type: String,
    required: true,
  },
  Booking: [
    {
      time: {
        type: String,
      },
      ref: {
        type: Array,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  ref_id: {
    type: String,
  },
});

module.exports = mongoose.model("booking", bookingSchema);
