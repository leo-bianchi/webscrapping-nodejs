/*jshint esversion: 8 */

const puppeteer = require('puppeteer');

const username = 'fiap';
const password = 'mpsp';

const url = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/';

module.exports = async function chromeInstance(portal) {

  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--incognito',
        '--aggressive-cache-discard'
      ],
      //executablePath: "/usr/bin/google-chrome",
      headless: false
    });

    const context = await browser.createIncognitoBrowserContext();

    const page = await context.newPage();

    let pages = await browser.pages();

    await pages[0].close();

    await page.goto(url).then(
      await doLogin(page, username, password)).then(
      await page.goto(portal));

    return page;

  } catch (e) {
    console.log(e);
    browser.close();
  }
};

async function doLogin(_page, _usr, _passwd) {
  await _page.waitForNavigation({
    waitUntil: 'load'
  });
  await _page.type('#username', _usr);
  await _page.type('#password', _passwd);
  await _page.click('button');
}
