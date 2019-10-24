/*jshint esversion: 9, node: true */

const router = require('express').Router();
const db_service = require("../service/db_service");
const parse = require('../libs/parseObject.js');
const response = require("../model/ResponseModel");

router.get('/login', async function(req, res) {
  let id = req.body.id;
  res.send(await db_service.login(id));

});

module.exports = router;
