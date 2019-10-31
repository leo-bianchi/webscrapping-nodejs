//jshint esversion: 9
const request_client = require('request-promise-native');

const path = require('path');
const fs = require('fs');

const puppeteer = require('puppeteer');

const username = 'fiap';

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
 * @param {string} _portal - Portal URL
 * @returns {Object} Logged Page
 * @module chromeInstance
 */
async function chromeInstance(_portal) {

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

  process.on('unhandledRejection', (reason) => {
    console.error('Error: ', reason.message);
    browser.close();
  });

  /**
   * @constant
   * @type {Object}
   * @default
   */
  const pages = await browser.pages();

  await pages[0].close();

  await page.goto(url).then(
    await doLogin(page, username, password)).then(
    await page.goto(_portal));

  return [page, browser];
}

async function doLogin(_page, _usr, _passwd) {
  await _page.waitForNavigation({
    waitUntil: 'networkidle0'
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

async function getPdf(_context, _action) {
  return new Promise(async function(resolve, reject) {
    await _context.setRequestInterception(true);
    _context.prependListener(_action, request => {
      if (request.url().endsWith('.pdf')) {
        request_client({
          uri: request.url(),
          encoding: null,
          headers: {
            'Content-type': 'applcation/pdf',
          },
        }).then(response => {
          resolve(response.toString('base64'));
          request.continue();
        });
      } else {
        request.continue();
      }
    });
  });
}

module.exports = {
  chromeInstance,
  evaluateData,
  getPdf,
};
