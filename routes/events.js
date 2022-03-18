const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const router = express.Router();
const Event = require("../model/events");

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
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete data

router.delete("/events/:id", getEvent, async (req, res) => {
  try {
    await res.event.remove();
    res.json({ message: "Delete success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.send(res.event);
});

router.patch("/events/:id", toggleEvent, async (req, res) => {
  if (req.body.isActive != null) {
    res.event.isActive = req.body.isActive;
  }
  try {
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
  try {
    eventfalse = await Event.findOne({ isActive: true });
    event = await Event.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: "Cannot find event" });
    }
    if (eventfalse != null) {
      eventfalse.isActive = false;
      eventfalse.save();
      res.json(eventfalse);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.event = event;
  next();
}

module.exports = router;
