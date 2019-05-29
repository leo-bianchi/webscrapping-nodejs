/*jshint esversion: 8 */

const puppeteer = require('puppeteer');

const url = 'https://www2.fiap.com.br';

void(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });

  try {
    const page = await browser.newPage();

    await page.goto(url);

    page.waitFor('body');

    page.$eval('#usuario', el => el.value = 'username');
    page.$eval('#senha', el => el.value = 'password');

    await page.click('input[type="submit"]');

    if (await page.url() != url + '/Aluno/Home') {
      browser.close();
      throw 'Invalid credentials';
    }

    await page.waitForSelector('.l-header-title');

    await page.goto(url + '/Aluno/Boletim');

    await page.select('select.i-boletim-info-select', '2SIR-2018');

    await page.waitForResponse(response => {
      return response.request().resourceType() === 'xhr';
    });

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
        data[i] = data[i] ? data[i] : {};
        data[i].disciplina = grabFromRow(tr, 'td.td-disciplina');

        data[i].nac = data[i].nac ? data[i].nac : {};
        data[i].nac.valor = grabFromRow(tr, 'td:nth-child(2)');

        data[i].am = data[i].am ? data[i].am : {};
        data[i].am.valor = grabFromRow(tr, 'td:nth-child(3)');

        data[i].ps = data[i].ps ? data[i].ps : {};
        data[i].ps.valor = grabFromRow(tr, 'td:nth-child(4)');

        data[i].faltas = data[i].faltas ? data[i].faltas : {};
        data[i].faltas.contagem = grabFromRow(tr, 'td:nth-child(5)');
        data[i].faltas.porcentagem = grabFromRow(tr, 'td:nth-child(13)');

        data[i].media = data[i].media ? data[i].media : {};
        data[i].media.valor = grabFromRow(tr, 'td:nth-child(6)');
      }
      return data;
    });

    console.log(result);

    await browser.close();

  } catch (error) {
    console.log(error);
    if (typeof browser !== 'undefined') {
      browser.close();
    }
  }
})();
