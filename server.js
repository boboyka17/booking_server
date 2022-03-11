const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const express = require("express");
const app = express();
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

app.listen(PORT, HOST, () => {
  console.log("Server started on " + HOST + ":" + PORT);
});
