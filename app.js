const express = require("express");
const path = require("path");

const app = express();

// set static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, "public", "chat.html"));
});

module.exports = app;
