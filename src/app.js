//jshint esversion: 9

const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

const port = 3000;

app.use(cors());

app.listen(port, () => {
  console.log('Server running on port', port);
});

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use('/api', require('./routes/index'));
app.use('/auth', require('./routes/login'));
