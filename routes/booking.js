const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const router = express.Router();
const Booking = require("../model/booking");

router.get("/booking", async (req, res) => {
  try {
    const booking = await Booking.find({ isActive: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/booking/:id", getBooking, async (req, res) => {
  res.send(res.booking);
});

router.get("/booking/ref_id/:id", getBookingRef, async (req, res) => {
  res.send(res.booking);
});

router.get("/booking/idCard/:id", getBookingidCard, async (req, res) => {
  const result = res.booking.Booking.find((item) =>
    item.ref.find((x) => x == req.params.id)
  );
  res.send({
    BookingID: res.booking._id,
    TimeId: result._id,
  });
});

router.patch("/booking/:id/:arrId", getBookingAvance, async (req, res) => {
  if (req.body.idCard != null) {
    const thisValue = res.booking.Booking.find(
      (item) => item.id === req.params.arrId
    );
    thisValue.ref.push(req.body.idCard);
  }
  try {
    const bookingUpdate = await res.booking.save();
    res.send(bookingUpdate);
  } catch (err) {
    res.json({ message: err.message });
  }
  // const update = "1959900623614";
  // res.booking.update;
  // const updateUser = await res.user.save();
});

async function getBooking(req, res, next) {
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}

async function getBookingAvance(req, res, next) {
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}

async function getBookingRef(req, res, next) {
  let booking;
  try {
    booking = await Booking.find({ ref_id: req.params.id });
    if (booking == null || booking.length < 1) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}

async function getBookingidCard(req, res, next) {
  let booking;
  try {
    booking = await Booking.findOne({
      Booking: { $elemMatch: { ref: req.params.id } },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}
module.exports = router;
