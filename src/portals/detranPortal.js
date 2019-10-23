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
    const detran = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/detran/login.html';

    /**
     * @async
     * @module sivecPortal
     * @returns {Object}
     */
    module.exports = async function detranPortal() {
      try {

        const page = await chrome.chromeInstance(detran);

        // await page.waitForSelector('span.ui-button-text');
        //
        // await page.click('button[name="form:j_id563205015_44efc15b"]');
        //
        // await page.waitForSelector('a#navigation_a_M_16');
        //
        // await page.click('a#navigation_a_M_16');
        //
        // await page.waitForSelector('a#navigation_a_F_16');
        //
        // await page.click('a#navigation_a_F_16');

        await page.goto('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/detran/pagina7-imagem-cnh.html');

        let data = await chrome.evaluateData(page, 'table.comBordaLeftBottom');
        let array = [];

        for (let d of data) {
          data = await d.split(/\r?\n/);
          await array.push(data);
        }

        let dados = await parse.matrix(array);

        console.log(dados);

      } catch (error) {
        console.log('Portal Detran =>', error);
        if (typeof page !== 'undefined') {
          page.close();
        }
      }

    };

  }());
