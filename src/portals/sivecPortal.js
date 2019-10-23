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
  const sivec = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/sivec/pagina3-pesquisa-rg.html';

  /**
   * @async
   * @module sivecPortal
   * @returns {Object}
   */
  module.exports = async function sivecPortal() {

    try {

      const page = await chrome.chromeInstance(sivec);

      await page.waitForSelector('#idValorPesq');
      // isto tem que ser alterado para o input do usuário no form.
      await page.$eval('#idValorPesq', el => el.value = '1.157.644');

      await page.click('#procurar');

      await page.waitForNavigation({
        waitUntil: 'load',
      });

      // trocar por input do usuário
      const a = await select(page).getElement('a:contains(1.157.644)');

      if (a) {
        await a.click();
      } else {
        throw new Error('Link not found');
      }

      await page.waitForNavigation({
        waitUntil: 'load',
      });

      const data = await chrome
        .evaluateData(page, 'table tr td span');

      let obj = await parse.toObject(data);

      obj = await parse.buildJson(obj);

      await page.close();

      return obj;

    } catch (error) {
      console.log('Portal Sivec =>', error);
      if (typeof page !== 'undefined') {
        page.close();
      }
    }
  };

}());
