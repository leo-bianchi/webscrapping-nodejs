const parse = require('../libs/parseObject.js');
const chrome = require('../libs/getChrome.js');

/**
 * @constant
 * @default
 * @type {string}
 */
const arisp = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arisp/login.html';

/**
 * @async
 * @module arispPortal
 * @returns {Object}
 */
module.exports = async function arispPortal() {

  const instances = await chrome.chromeInstance(arisp);

  const page = instances[0];
  const browser = instances[1];

  try {

    await page.waitForSelector('#btnCallLogin');
    await page.click('#btnCallLogin');

    await page.waitForSelector('#btnAutenticar');
    await page.click('#btnAutenticar');

    await page.waitForSelector('body');
    await page.hover('#liInstituicoes');

    await page.waitForSelector('a[href="pagina4-tipo-de-pesquisa.html"]');
    await page.click('a[href="pagina4-tipo-de-pesquisa.html"]');

    await page.waitForSelector('#Prosseguir');
    await page.click('#Prosseguir');

    await page.waitForSelector('.checkbox > input');
    await page.click('.checkbox > input');

    await page.waitForSelector('#dvMensagem > label > input');
    await page.$eval('#dvMensagem > label > input', elem => elem.click());

    await page.click('#Prosseguir');

    await page.waitForSelector('#btnPesquisar');
    await page.click('#btnPesquisar');

    await page.waitForSelector('body');

    await page.$eval('#chk339', elem => elem.click());
    await page.$eval('#chk7', elem => elem.click());
    await page.$eval('#chk10', elem => elem.click());
    await page.$eval('#chk18', elem => elem.click());

    await page.click('#btnProsseguir');

    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));

    await page.waitForSelector('#matriculas');
    await page.$eval('table#matriculas > tbody > tr > td > a:first-child', elem => elem.click());

    const newPage = await newPagePromise;

    console.log(await newPage.url())
    console.log(await page.url())

    const pdf = chrome.getPdf(newPage, 'request');

    await newPage.goto(newPage.url());

    await page.close();
    await newPage.close();

    return await pdf;

  } catch (error) {
    console.log('Portal Arisp =>', error);
    const message = {
      status: 500,
      error: error.message
    }
    if (typeof page !== 'undefined') {
      page.close();
    }
    if (typeof newPage !== 'undefined') {
      newPage.close();
    }
    return message;
  }
};
