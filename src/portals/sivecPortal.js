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
module.exports = async function sivecPortal(rg) {

  const instances = await chrome.chromeInstance(sivec);

  const page = instances[0];

  try {

    let input = rg;

    await page.waitForSelector('#idValorPesq');

    await page.$eval('#idValorPesq', (el, _input) => el.value = _input, input);

    await page.click('#procurar');

    await page.waitForNavigation({
      waitUntil: 'load',
    });

    const a = await select(page)
      .getElement('a:contains(' + input + ')');

    if (a) {
      await a.click();
    } else {
      throw new Error('Link not found');
    }

    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });

    const data = await chrome.evaluateData(page, 'table tr td span');

    await page.close();

    const obj = await parse.toObject(data);

    return obj;

  } catch (error) {
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
