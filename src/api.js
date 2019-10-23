/*jshint esversion: 9, strict: true, node: true */

(function() {
  'use strict';

  const express = require('express');

  const sivecPortal = require('./portals/sivecPortal.js');
  const sielPortal = require('./portals/sielPortal.js');
  const cadespPortal = require('./portals/cadespPortal.js');
  const detranPortal = require('./portals/detranPortal.js');

  const app = express();
  const port = 3000;

  app.listen(port, () => {
    console.log('Server running on port', port);
  });

  app.get('/api', (req, res, next) => {
    getResult().then((obj) => {
      res.json(obj);
    });
  });

  async function getResult() {

    let obj = detranPortal();
    //
    // let [sivec, cadesp, siel] = await Promise.all(
    //   [
    //     sivecPortal(),
    //     cadespPortal(),
    //     sielPortal(),
    //     detranPortal(),
    //   ]);

    return obj;

    // return [sivec, cadesp];
  }

}());
