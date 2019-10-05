/*jshint esversion: 8 */

const puppeteer = require('puppeteer');
const select = require('puppeteer-select');
var fromEntries = require('object.fromentries');

const url = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/';
const sivec = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/sivec/pagina3-pesquisa-rg.html';

async function portalSivec() {
  const browser = await puppeteer.launch({
    headless: false
  });

  try {
    const page = await browser.newPage();

    await page.goto(url);

    await Promise.all([
       page.waitForNavigation({
         waitUntil: 'load'
       }),
       page.$eval('#username', el => el.value = 'fiap'),
       page.$eval('#password', el => el.value = 'mpsp'),
       page.click('button')
     ]);

    await page.goto(sivec);

    await page.waitFor('body');
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

    const data1 = await page.$$eval('table tr td span',
      spans => spans.map((span) => {
        return span.innerText.trim();
      }));

    Array.prototype.toObject = await

    function() {
      let r = {};
      for (let i = 0; i < this.length; i += 2) {
        let key = removerAcentos(this[i]),
          value = this[i + 1];
        r[key] = value;
      }
      return r;
    };

    var obj = await data1.toObject();

    obj = fromEntries(
      Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
    );

    await browser.close();

    return obj;

  } catch (error) {
    console.log(error);
    if (typeof browser !== 'undefined') {
      browser.close();
    }
  }
}

module.exports = portalSivec;

function removerAcentos(newStringComAcento) {
  var string = newStringComAcento;
  var mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
    '-': /\s/g
  };

  for (var letra in mapaAcentosHex) {
    var expressaoRegular = mapaAcentosHex[letra];
    string = string.replace(expressaoRegular, letra);
  }

  return string;
}
