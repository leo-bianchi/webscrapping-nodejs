/*jshint esversion: 9, node: true */

(function() {
  'use strict';

  const parse = require('../libs/parseObject.js');
  const chrome = require('../libs/getChrome.js');

  /**
   * @constant
   * @default
   * @type {string}
   */
  const caged = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/caged/login.html';

  /**
   * @async
   * @module sivecPortal
   * @returns {Object}
   */
  module.exports = async function cagedPortal() {

    try {

      const instances = await chrome.chromeInstance(caged);

      const page = instances[0];

      await page.waitForSelector('input[type=submit]');
      await page.click('input[type=submit]');


    } catch (error) {
      console.log('Portal Cadesp =>', error);
      if (typeof page !== 'undefined') {
        page.close();
      }
    }
  };

}());
