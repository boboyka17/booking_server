const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const express = require("express");
const app = express();

app.listen(PORT, HOST, () => {
  console.log("Server started on " + HOST + ":" + PORT);
});
app.get("/", (req, res) => {
  res.send("hello");
});
