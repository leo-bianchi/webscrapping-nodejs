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
  const afterLogin = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/caged/pagina2-pesquisa.html?username=&password=&lt=LT-127198-1ccwL7A9tvEXNbmoDsSoVXHYYDcplU-v121p430.geridmte.dataprev.gov.br&execution=e1s1&_eventId=submit&submit=Entrar';

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

        await page.navigate('a[href="pagina3-consulta-autorizado-responsavel.html"]');

        const autorizadoresponsavel = await page.getData();

      let obj = {};

      obj.autorizadoresponsavel = await parse.toObject(autorizadoresponsavel);

      await page.goto(afterLogin);

      await page.navigate('a[href="pagina4-consulta-empresa.html"]');

      const empresa = await page.getData();

      obj.empresa = parse.toObject(empresa);

      await page.goto(afterLogin);

      await page.navigate('a[href="pagina6-consulta-trabalhador.html"]');

      const trabalhador = await page.getData();

      obj.trabalhador = await parse.toObject(trabalhador);

      await page.close();

      return obj;

    } catch (error) {
      console.log('Portal Caged =>', error);
      if (typeof page !== 'undefined') {
        page.close();
      }
    }
  };

  Object.prototype.getData = async function() {

    await this.waitForSelector('div.linha');

    let array = await chrome.evaluateData(this, 'div.linha');

    let p = [];

    for (let entry of array) {
      if (entry.indexOf('\n') < 0 || entry.endsWith(':'))
        entry += '\n';
      array = entry.split(/\n/g);
      for (let a of array) {
        if (a.endsWith(' :')) {
          a = a.replace(' :', '');
        }
        a = a.trim();
        p.push(a);
      }
    }

    return p;
  };

  Object.prototype.navigate = async function(selector) {

    await this.waitForSelector('span[id^="j_idt12:lk_menu_consultas"]');
    await this.hover('span[id^="j_idt12:lk_menu_consultas"]');

    await this.waitForSelector(selector);
    await this.click(selector);

    await this.waitForSelector('input[type="submit"]');
    await this.click('input[type="submit"]');

    return this;

  };

}());
