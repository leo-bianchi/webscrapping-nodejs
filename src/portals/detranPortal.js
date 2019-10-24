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

        const instances = await chrome.chromeInstance(detran);

        const page = await instances[0];

        await page.waitForSelector('span.ui-button-text');

        await page.click('button[name="form:j_id563205015_44efc15b"]');

        await page.waitForSelector('a#navigation_a_M_16');

        await page.click('a#navigation_a_M_16');

        await page.waitForSelector('a#navigation_a_F_16');

        await page.click('a[href="pagina3-pesquisa-linha-de-vida.html"]');

        await page.waitForSelector('a[href="pagina6-relatório-linha-de-vida.pdf"]');

        const newUrl = await detran.replace('/login.html', '');

        chrome.getPdf(page, 'request', 'DETRAN - Relatorio Linha de Vida');

        await page.goto(newUrl + '/pagina6-relatório-linha-de-vida.pdf').catch(error => {});

        await page.goto(newUrl + '/pagina2-pesquisa.html');

        await page.waitForSelector('a#navigation_a_M_18');

        await page.click('a#navigation_a_M_18');

        await page.waitForSelector('a[href="pagina5-pesquisa-veiculo.html"]');

        await page.click('a[href="pagina5-pesquisa-veiculo.html"]');

        await page.waitForSelector('a[href="pagina7-relatório-veiculo.pdf"]');

        await page.removeAllListeners('request');

        chrome.getPdf(page, 'request', 'DETRAN - Veiculo Base Estadual');

        await page.goto(newUrl + '/pagina7-relatório-veiculo.pdf').catch(error => {});

        await page.goto(newUrl + '/pagina2-pesquisa.html');

        await page.waitForSelector('a#navigation_a_M_16');

        await page.click('a#navigation_a_M_16');

        await page.waitForSelector('a[href="pagina4-pesquisa-imagem-cnh.html"]');

        await page.click('a[href="pagina4-pesquisa-imagem-cnh.html"]');

        await page.waitForSelector('a[href="pagina7-imagem-cnh.html"]');

        const browser = await instances[1];

        const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));

        await page.click('a[href="pagina7-imagem-cnh.html"]');

        const newPage = await newPagePromise;

        await newPage.waitForSelector('table.comBordaLeftBottom');

        let data = await chrome
          .evaluateData(newPage, 'table.comBordaLeftBottom')
          .innerText;

        let array = [];

        for (let d of data) {
          data = await d.split(/\r?\n/);
          await array.push(data);
        }

        const obj = await parse.matrixToObject(array);

        return obj;

      } catch (error) {
        console.log('Portal Detran =>', error);
        if (typeof page !== 'undefined') {
          page.close();
        }
      }

    };

  }());
