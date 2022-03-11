require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

// dp config
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));

app.use(express.json());

// route setting
const users = require("./routes/users");
const events = require("./routes/events");
const auth = require("./routes/auth");

app.use("/api", users);
app.use("/api", events);
app.use("/api", auth);

app.listen(port, () => console.log("Server Started"));
