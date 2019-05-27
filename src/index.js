/*jshint esversion: 8 */

const puppeteer = require('puppeteer');

const url = 'https://www2.fiap.com.br';

void(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.goto(url);

    page.waitFor('body');

    page.$eval('#usuario', el => el.value = 'username');
    page.$eval('#senha', el => el.value = 'password');

    page.click('input[type="submit"]');

    await page.waitForSelector('.l-header-title');

    await page.goto(url + '/Aluno/Boletim');

    await page.select('select.i-boletim-info-select', '2SIR-2018');

    await page.waitFor(1500);

    const result = await page.evaluate(() => {
      // a helper function for some slight code reuse
      // grab the TD, the text and remove trailing whitespace
      const grabFromRow = (row, selector) => row
        .querySelector(`${selector}`)
        .innerText
        .trim();

      const DISCIPLINA_ROW_SELECTOR = 'tr.i-boletim-table-row';

      var data = [];

      const disciplinaRows = document.querySelectorAll(DISCIPLINA_ROW_SELECTOR);

      for (const [i, tr] of disciplinaRows.entries()) {
        if (data[i] == undefined) {
          data[i] = {};
        }
        data[i].disciplina = grabFromRow(tr, 'td.td-disciplina');
        if (data[i].nac == undefined) {
          data[i].nac = {};
        }
        data[i].nac.valor = grabFromRow(tr, 'td:nth-child(2)');
      }
      return data;
    });

    //   grade = await page.evaluate(() => {
    // 	return document.querySelector('tr.i-boletim-table-row').innerText;
    // });

    //console.log(grade);

    console.log(result);

    await browser.close();

  } catch (error) {
    console.log(error);
    browser.close();
  }
})();

