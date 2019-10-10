/*jshint esversion: 8 */
const select = require('puppeteer-select');
const parse = require('./libs/parseObject.js');
const chromeInstance = require('./libs/getChrome.js');

const sivec = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/sivec/pagina3-pesquisa-rg.html';

module.exports = async function sivecPortal() {

  try {

    const page = await chromeInstance(sivec);

    await page.waitForSelector('#idValorPesq');
    // isto tem que ser alterado para o input do usuário no form.
    await page.$eval('#idValorPesq', el => el.value = '1.157.644');

    await page.click('#procurar');

    await page.waitForNavigation({
      waitUntil: 'load',
    });

    // trocar por input do usuário
    const a = await select(page).getElement('a:contains(1.157.644)');

    if (a) {
      await a.click();
    } else {
      throw new Error("Link not found");
    }

    await page.waitForNavigation({
      waitUntil: 'load',
    });

    const data = await page.$$eval('table tr td span',
      spans => spans.map((span) => {
        return span.innerText.trim().replace(':', '').replace('º', '');
      }));

    Array.prototype.toObject = await

    function() {
      let r = {};

      for (let i = 0; i < this.length; i += 2) {
        let key = (this[i]),
          value = this[i + 1];
        r[key] = value;
      }
      return r;
    };

    var obj = await data.toObject();

    obj = await parse.buildJson(obj);

    // Global
    obj = await Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, v])
    );

    await page.close();

    return obj;

  } catch (error) {
    console.log('Portal Sivec =>', error);
    if (typeof page !== 'undefined') {
      page.close();
    }
  }
};
