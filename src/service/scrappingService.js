/*jshint esversion: 9, node: true, strict: true */

(function() {
  'use strict';

  const sivecPortal = require('../portals/sivecPortal.js');
  const sielPortal = require('../portals/sielPortal.js');
  const cadespPortal = require('../portals/cadespPortal.js');
  const detranPortal = require('../portals/detranPortal.js');
  const arpenpPortal = require('../portals/arpenpPortal.js');
  const infocrimPortal = require('../portals/infocrimPortal.js');
  const censecPortal = require('../portals/censecPortal');

  scrapAll().then((obj) => {
    console.log(obj);
  });

  async function scrapAll() {
    console.log('startou');

    let obj = censecPortal();

    // let [sivec, cadesp, siel, detran] = await Promise.all(
    //   [
    //     sivecPortal(),
    //     cadespPortal(),
    //     sielPortal(),
    //     detranPortal(),
    //   ]);

    return obj;
  }

}());
