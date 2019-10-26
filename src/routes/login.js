const router = require('express').Router();
const db_service = require("../service/db_service");
const parse = require('../libs/parseObject.js');
const response = require("../model/ResponseModel").responseModel;

router.post('/login', async function(req, res) {
    var user = req.body;
    var hasLogin = await db_service.validateLogin(user);

    if(hasLogin.length){
        response.status = 200;
        response.data = hasLogin;
    }
    else{
    response.status = 401;
    response.data = null;
    }

    res.statusCode = response.status;
    res.send(response);
});

module.exports = router;
