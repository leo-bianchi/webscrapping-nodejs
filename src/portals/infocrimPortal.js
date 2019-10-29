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
  const infocrim = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/infocrim/login.html';

  /**
   * @async
   * @module cadespPortal
   * @returns {Object}
   */
  module.exports = async function infocrimPortal() {

    try {

      const instances = await chrome.chromeInstance(infocrim);

      const page = instances[0];

      await page.waitForSelector('a[href="pagina2-pesquisa.html"]');
      await page.click('a[href="pagina2-pesquisa.html"]');

      await page.waitForSelector('a#submit');
      await page.click('a#submit');

      await page.waitForSelector('a[href="pagina4-detalhes-bo.html"]');
      await page.click('a[href="pagina4-detalhes-bo.html"]');

      await page.waitForSelector('pre');

      let data = await page.$eval('pre', el => el.innerText);

      data = await data.replace(/\t/g, '');

      let array = data.split(': ');

      let p = [];

      for (let entry of array) {
        array = entry.split(/\n/g);
        for (let a of array) {
          a = a.trim();
          let hora = a.replace(/HORA/g, "@@@.HORA");
          let newHora = hora.split("@@@.");
          for (let n of newHora) {
            n = n.trim();
            p.push(n);
          }
        }
      }

      await p.verify();
      await p.fix();

      const obj = parse.toObject(p);

      await page.close();

      return obj;

    } catch (error) {
      console.log('Portal Infocrim =>', error);
      if (typeof page !== 'undefined') {
        page.close();
      }
    }
  };

}());

Array.prototype.verify = function() {
  for (let i = 0; i < this.length; i++) {
    if (this[i] == '' && this[i + 1] == '' && this[i - 1] == '') {
      this.splice(i - 1, 3);
    }
  }
  return this;
};

Array.prototype.fix = function(elem) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] == '' && this[i + 1] == '') {
      this.splice(i, 2);
    }
  }

  this.splice(4, 1);
  this.splice(8, 1);
  this.splice(28, 1);

  this.pop();
  return this;
};
