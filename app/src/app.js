const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello from the sample CI/CD app!",
    service: "sample-cicd-app",
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;

