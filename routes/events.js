const express = require("express");
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
  //   res.send(res.user);
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

module.exports = router;
