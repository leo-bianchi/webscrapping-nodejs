/*jshint esversion: 8 */

var express = require("express");
const func = require('./index.js');

var app = express();

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/url", (req, res, next) => {
    getResult().then((obj) =>{
        res.json(obj);
    });
});

async function getResult() {
    const obj = await func();
    return obj;
}
