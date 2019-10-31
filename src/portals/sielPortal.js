const parse = require('../libs/parseObject.js');
const chrome = require('../libs/getChrome.js');

/**
 * @constant
 * @default
 * @type {string}
 */
const siel = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/siel/login.html';

/**
 * @async
 * @module sivecPortal
 * @returns {Object}
 */
module.exports = async function sielPortal() {

  const instances = await chrome.chromeInstance(siel);

  const page = instances[0];

  try {

    await page.waitForSelector('input[type=submit]');

    await page.click('input[type=submit]');

    await page.waitForSelector('input[type=image]');

    await page.$eval('input[name=nome]', el => el.value = 'teste');

    await page.$eval('#num_processo', el => el.value = '123');

    await page.click('input[type=image]');

    await page.waitForSelector('table.lista tbody tr td');

    const data = await chrome
      .evaluateData(page, 'table tr td');

    await page.close();

    await data.splice(0, 2);

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
