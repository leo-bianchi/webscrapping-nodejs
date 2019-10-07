/*jshint esversion: 8 */

const express = require("express");
const sivecPortal = require('./sivecPortal.js');

const app = express();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/api", (req, res, next) => {
  getResult().then((obj) => {
    res.json(obj);
  });
});

async function getResult() {
  const obj = await sivecPortal();
  return obj;
}
