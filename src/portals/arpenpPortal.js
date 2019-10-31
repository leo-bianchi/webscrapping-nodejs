const parse = require('../libs/parseObject.js');
const chrome = require('../libs/getChrome.js');

/**
 * @constant
 * @default
 * @type {string}
 */
const arpenp = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arpensp/login.html';

/**
 * @async
 * @module arpenpPortal
 * @returns {Object}
 */
module.exports = async function arpenpPortal() {

  const instances = await chrome.chromeInstance(arpenp);

  const page = instances[0];

  try {

    await page.waitForSelector('a[href="pagina2-pesquisa.html"]');
    await page.click('a[href="pagina2-pesquisa.html"]');

    await page.waitForSelector('li.item3 > a > #arrumaMenu');
    await page.click('li.item3 > a > #arrumaMenu');

    await page.waitForSelector('li.subitem1 > a[href="pagina3-busca.html"]');
    await page.$eval('li.subitem1 > a[href="pagina3-busca.html"]', elem => elem.click());

    await page.waitForSelector('#btn_pesquisar');
    await page.click('#btn_pesquisar');

    await page.waitForSelector('table');

    const data = await chrome.evaluateData(page, 'table tbody tr td');

    await page.close();

    for (let i = 0; i <= data.length; i++) {
      if (data[i] == '' && data[i + 1] == '') {
        data.splice(i, 1);
      }
    }

    const newData = data.slice(0, -4);

    newData.splice(newData.indexOf('CASAMENTO RELIGIOSO') - 1, 2);

    newData.splice(16, 1);

    for (let i in newData) {
      console.log(i, newData[i]);
    }

    const obj = parse.toObject(newData);

    return obj;

  }  catch (error) {
    console.log('Portal Arpenp =>', error);
    const message = {
      status: 500,
      error: error.message
    }
    if (typeof page !== 'undefined') {
      page.close();
    }
    return obj;
  }
};
