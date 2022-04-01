const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const router = express.Router();
const Event = require("../model/events");
const Booking = require("../model/booking");

// get data

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get data id

router.get("/events/:id", getEvent, (req, res) => {
  res.send(res.event);
});

// post data

router.post("/events", async (req, res) => {
  const event = new Event({
    title: req.body.title,
    eventDays: req.body.eventDays,
    color: req.body.color,
  });

  const temp = req.body.eventDays.map(
    (item) =>
      (result = {
        ref_id: event._id,
        dateTitle: item,
        Booking: [
          {
            time: "9:30",
            ref: [],
          },
          {
            time: "10:00",
            ref: [],
          },
          {
            time: "10:30",
            ref: [],
          },
          {
            time: "11:00",
            ref: [],
          },
          {
            time: "11:30",
            ref: [],
          },
          {
            time: "1:30",
            ref: [],
          },
          {
            time: "2:00",
            ref: [],
          },
          {
            time: "2:30",
            ref: [],
          },
        ],
      })
  );
  try {
    await Booking.insertMany(temp);
    const newEvent = await event.save();
    res.status(200).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete data

router.delete("/events/:id", getEvent, async (req, res) => {
  try {
    await Booking.deleteMany({ ref_id: req.params.id });
    await res.event.remove();
    res.json({ message: "Delete success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.send(res.event);
});

router.patch("/events/:id", toggleEvent, async (req, res) => {
  if (req.body.isActive != null) {
    res.isActive = req.body.isActive;
    res.event.isActive = req.body.isActive;
    res.booking.map((obj) => {
      obj.isActive = req.body.isActive;
    });
  }
  try {
    await res.booking.map((obj) => {
      obj.save();
    });
    const updateEvent = await res.event.save();
    res.json(updateEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getEvent(req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: "Cannot find event" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.event = event;
  next();
}

async function toggleEvent(req, res, next) {
  let eventfalse;
  let event;
  let booking;
  try {
    eventfalse = await Event.findOne({ isActive: true });
    event = await Event.findById(req.params.id);
    booking = await Booking.find({ ref_id: req.params.id });
    bookingfalse = await Booking.find({ isActive: true });
    // ไม่พบกิจกรรมในฐานข้อมูล
    if (event == null) {
      return res.status(404).json({ message: "Cannot find event" });
    }
    // พบกิจกรรมในฐานข้อมูล และ กิจกรรมนั้นเปิดใช้งานอยู่ ทำการปิดการใช้งานตัวกิจกรรมนั้น
    if (eventfalse != null) {
      eventfalse.isActive = false;
      eventfalse.save();
      bookingfalse.map((obj) => {
        obj.isActive = false;
        obj.save();
      });
      res.json(eventfalse);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // get ตัวกิจกรรม
  res.event = event;
  res.booking = booking;
  next();
}

module.exports = router;
