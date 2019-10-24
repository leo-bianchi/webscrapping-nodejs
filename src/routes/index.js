/*jshint esversion: 9, node: true */

const router = require('express').Router();
const db_service = require('../service/db_service');
const parse = require('../libs/parseObject.js');
const response = require('../model/responseModel').responseModel;

router.get('/search', function(req, res) {
  let key = req.body.key;
  let type = req.body.type;

  if (type == 'cpf')
    var x;
  else
    var y;
});

router.get('/historic', async function(req, res) {
  response.status = 200;
  let id = req.body.id;
  response.data = await db_service.selectHistoric(id);
  res.send(response);
});


module.exports = router;
