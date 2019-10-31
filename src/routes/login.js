const router = require('express').Router();
const dbService = require('../service/dbService.js');
const parse = require('../libs/parseObject.js');
const response = require('../model/responseModel.js').responseModel;

router.post('/login', async function(req, res) {
  var user = req.body;
  var hasLogin = await dbService.validateLogin(user);

  if (hasLogin.length) {
    response.status = 200;
    response.data = hasLogin;
  } else {
    response.status = 401;
    response.data = null;
  }

  res.statusCode = response.status;
  res.send(response);
});

module.exports = router;
