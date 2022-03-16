const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const router = express.Router();
const Users = require("../model/users");
const bcrypt = require("bcrypt");
const SALT_ROUND = 8;
// get data

router.get("/users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get data id

router.get("/users/:id", getUser, (req, res) => {
  res.send(res.user);
});

// post data

router.post("/users", async (req, res) => {
  const user = new Users({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, SALT_ROUND),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update data

router.patch("/users/:id", getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = bcrypt.hashSync(req.body.password, SALT_ROUND);
  }
  if (req.body.firstname != null) {
    res.user.firstname = req.body.firstname;
  }
  if (req.body.lastname != null) {
    res.user.lastname = req.body.lastname;
  }
  if (req.body.role != null) {
    res.user.role = req.body.role;
  }

  try {
    const updateUser = await res.user.save();
    res.json(updateUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  res.send(res.user);
});

// delete data

router.delete("/users/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Delete success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.send(res.user);
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await Users.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
