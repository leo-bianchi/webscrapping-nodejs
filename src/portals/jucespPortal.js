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

  const instances = await chrome.chromeInstance(jucesp);

  const page = instances[0];

  try {

    await page.waitForSelector('td.item02 > input');
    await page.click('td.item02 > input');

    await page.waitForSelector('.btcadastro');
    await page.click('.btcadastro');

    await page.waitForSelector('a[href="pagina4-dados.html"]').then(() => {
      page.click('a[href="pagina4-dados.html"]:first-child');
    });

    const obj = await page.getData();

    await page.close();

    return obj;

  } catch (error) {
    console.log('Portal Jucesp =>', error);
    const message = {
      status: 500,
      error: error.message
    }
    if (typeof page !== 'undefined') {
      page.close();
    }
    return message;
  }
};

Object.prototype.getData = async function() {
  const that = this;

  return new Promise(async function(resolve, reject) {
    that.waitForNavigation({
      waitUntil: 'load'
    }).then(async function(obj) {

      const data = await chrome.evaluateData(that, 'table.informacoes > tbody > tr > td > p > span');
      const label = await chrome.evaluateData(that, 'table.informacoes > tbody > tr > td > p:first-child');

      const labelEndereco = await chrome.evaluateData(that, 'table#dados_endereco > tbody > tr > td > p:first-child');
      const dataEndereco = await chrome.evaluateData(that, 'table#dados_endereco > tbody > tr > td > p > span');

      const array = [];

      for (let i = 0; i < data.length; i++) {
        array.push(label[i]);
        array.push(data[i]);
      }

      for (let j = 0; j < dataEndereco.length; j++) {
        array.push(labelEndereco[j]);
        array.push(dataEndereco[j]);
      }

      obj = parse.toObject(array);
      resolve(obj);
    });
  });
};
