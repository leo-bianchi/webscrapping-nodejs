/*jshint esversion: 9, strict: true, node: true */

(function() {
  'use strict';

  const select = require('puppeteer-select');
  const parse = require('../libs/parseObject.js');
  const chrome = require('../libs/getChrome.js');

  /**
   * @constant
   * @default
   * @type {string}
   */
  const jucesp = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/jucesp/index.html';

  /**
   * @async
   * @module sivecPortal
   * @returns {Object}
   */
  module.exports = async function jucespPortal() {

    try {

      const instances = await chrome.chromeInstance(jucesp);

      const page = instances[0];




    } catch (error) {
      console.log('Portal Jucesp =>', error);
      if (typeof page !== 'undefined') {
        page.close();
      }
    }
  };

}());
