/*jshint esversion: 8, strict: true, node: true */

(function() {
  'use strict';

  const puppeteer = require('puppeteer');

  /**
   * @constant
   * @type {string}
   * @default
   */
  const username = 'fiap';

  /**
   * @constant
   * @type {string}
   * @default
   */
  const password = 'mpsp';

  /**
   * @constant
   * @type {string}
   * @default
   */
  const url = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/';

  /**
   * Create new Chromium
   * @async
   * @param {string} portal - Portal URL
   * @returns {Object} Logged Page
   * @module chromeInstance
   */
  async function chromeInstance(portal) {

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

      /**
       * @constant
       * @type {Object}
       * @default
       */
      const context = await browser.createIncognitoBrowserContext();

      /**
       * @constant
       * @type {Object}
       * @default
       */
      const page = await context.newPage();

      /**
       * @constant
       * @type {Object}
       * @default
       */
      let pages = await browser.pages();

      await pages[0].close();

      await page.goto(url).then(
        await doLogin(page, username, password)).then(
        await page.goto(portal));

      return page;

    } catch (e) {
      console.log("Failed on Chrome Instance\n", e);
      browser.close();
    }
  }

  /**
   * Do login on main page
   * @async
   * @param {Object} _page - Page to login
   * @param {string} _usr - Username
   * @param {string} _passwd - Password
   */
  async function doLogin(_page, _usr, _passwd) {
    await _page.waitForNavigation({
      waitUntil: 'load'
    });
    await _page.type('#username', _usr);
    await _page.type('#password', _passwd);
    await _page.click('button');
  }

  /**
   * Get data from page base on specific selectors
   * @async
   * @param {Object} _page
   * @param {string} _selector
   * @module evaluateData
   */
  async function evaluateData(_page, _selector) {
    let _data = await _page.$$eval(_selector,
      values => values.map((value) => {
        return value.innerText.trim().replace(/\t/g, '').replace(':', '').replace('º', '');
      }));

    return _data;
  }

  module.exports = {
    chromeInstance,
    evaluateData,
  };
}());
