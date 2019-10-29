const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require('cors');

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
