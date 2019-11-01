const parse = require('../libs/parseObject.js');
const chrome = require('../libs/getChrome.js');

/**
 * @constant
 * @default
 * @type {string}
 */
const censec = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/censec/login.html';

/**
 * @async
 * @module sivecPortal
 * @returns {Object}
 */
module.exports = async function censecPortal() {

  const instances = await chrome.chromeInstance(censec);

  const page = instances[0];

  try {

    const navigationPromise = page.waitForNavigation();

    await page.waitForSelector('#CaixaLogin > #FlagLogin #EntrarButton');
    await page.click('#CaixaLogin > #FlagLogin #EntrarButton');

    await navigationPromise;

    await page.waitForSelector('#ctl00_CESDIConsultaAtoHyperLink');
    await page.evaluate(() => {
      (document.getElementById(
        'ctl00_CESDIConsultaAtoHyperLink'
      )).click();
    });

    await navigationPromise;

    await page.waitForSelector(
      '.AreaFormulario #ctl00_ContentPlaceHolder1_DocumentoTextBox'
    );
    await page.click(
      '.AreaFormulario #ctl00_ContentPlaceHolder1_DocumentoTextBox'
    );

    await page.waitForSelector(
      '.InternaAbas #ctl00_ContentPlaceHolder1_BuscarButton'
    );
    await page.click('.InternaAbas #ctl00_ContentPlaceHolder1_BuscarButton');

    await navigationPromise;

    await page.waitForSelector(
      'table > tbody > .linha1Tabela:nth-child(2) > td > input'
    );
    await page.click('table > tbody > .linha1Tabela:nth-child(2) > td > input');

    await page.waitForSelector(
      '#ctl00_ContentPlaceHolder1_ResultadoBuscaGeralPanel #ctl00_ContentPlaceHolder1_VisualizarButton'
    );
    await page.click(
      '#ctl00_ContentPlaceHolder1_ResultadoBuscaGeralPanel #ctl00_ContentPlaceHolder1_VisualizarButton'
    );

    await navigationPromise;

    await page.waitForSelector(
      '.Conteudo > .InternaAbas > .AreaFormulario > .CampoSimples:nth-child(1) > span'
    );
    const json = {};

    await page.waitForSelector(
      '.InternaAbas #ctl00_ContentPlaceHolder1_CodigoTextBox'
    );
    await page.click('.InternaAbas #ctl00_ContentPlaceHolder1_CodigoTextBox');

    await page.waitForSelector(
      '.Conteudo > .InternaAbas > .AreaFormulario:nth-child(4) > .CampoSimples:nth-child(2) > span'
    );
    await page.click(
      '.Conteudo > .InternaAbas > .AreaFormulario:nth-child(4) > .CampoSimples:nth-child(2) > span'
    );

    await page.waitForSelector(
      '.Conteudo > .InternaAbas > .AreaFormulario:nth-child(4) > .CampoSimples:nth-child(2) > span'
    );
    await page.click(
      '.Conteudo > .InternaAbas > .AreaFormulario:nth-child(4) > .CampoSimples:nth-child(2) > span'
    );

    await page.waitForSelector(
      '.Conteudo > .InternaAbas > .AreaFormulario:nth-child(4) > .CampoSimples:nth-child(2) > div'
    );
    await page.click(
      '.Conteudo > .InternaAbas > .AreaFormulario:nth-child(4) > .CampoSimples:nth-child(2) > div'
    );

    await page.waitForSelector(
      '.Geral > .Centraliza > .Conteudo > .InternaAbas > .AreaFormulario:nth-child(4)'
    );
    await page.click(
      '.Geral > .Centraliza > .Conteudo > .InternaAbas > .AreaFormulario:nth-child(4)'
    );

    await page.waitForSelector(
      '.Conteudo > .InternaAbas > .AreaFormulario > .CampoSimples:nth-child(3) > span'
    );
    await page.click(
      '.Conteudo > .InternaAbas > .AreaFormulario > .CampoSimples:nth-child(3) > span'
    );

    await page.waitForSelector(
      '.Geral > .Centraliza > .Conteudo > .InternaAbas > .AreaFormulario:nth-child(4)'
    );
    await page.click(
      '.Geral > .Centraliza > .Conteudo > .InternaAbas > .AreaFormulario:nth-child(4)'
    );

    await page.waitForSelector('.Listview > table');
    await page.waitForSelector(
      '#ctl00_ContentPlaceHolder1_DadosCartorio_DivTelefonesCartorioListView > table'
    );

    const partesContent = await page.evaluate(() => {
      const names = [];
      const documents = [];
      const quality = [];
      const partes = [];

      const table = document.querySelectorAll(
        '#ctl00_ContentPlaceHolder1_PartesUpdatePanel > table > tbody'
      );

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < table[0].children.length; i++) {
        const element = table[0].children[i];
        names.push(element.cells[1].innerText);
        documents.push(element.cells[2].innerText);
        quality.push(element.cells[3].innerText);
        partes.push({
          nome: '',
          documento: '',
          qualidade: ''
        });
      }
      names.map((name, index) => {
        partes[index].nome = name;
      });
      documents.map((doc, index) => {
        partes[index].documento = doc;
      });
      quality.map((value, index) => {
        partes[index].qualidade = value;
      });

      return partes;
    });

    const dadosCartorioContent = await page.evaluate(() => {
      const tel = [];
      const tipo = [];
      const ramal = [];
      const contato = [];
      const status = [];
      const dadosCartorio = [];

      const table = document.querySelectorAll(
        '#ctl00_ContentPlaceHolder1_DadosCartorio_DivTelefonesCartorioListView > .rolagem > table > tbody'
      );
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < table[0].children.length; i++) {
        const element = table[0].children[i];
        dadosCartorio.push({
          contato: '',
          telefone: '',
          ramal: '',
          status: '',
          tipo: ''
        });
        tel.push(element.cells[0].innerText);
        tipo.push(element.cells[1].innerText);
        ramal.push(element.cells[2].innerText);
        contato.push(element.cells[3].innerText);
        status.push(element.cells[4].innerText);
      }

      tel.map((value, index) => {
        dadosCartorio[index].telefone = value;
      });
      tipo.map((value, index) => {
        dadosCartorio[index].tipo = value;
      });
      ramal.map((value, index) => {
        dadosCartorio[index].ramal = value;
      });
      contato.map((value, index) => {
        dadosCartorio[index].contato = value;
      });
      status.map((value, index) => {
        dadosCartorio[index].status = value;
      });
      return dadosCartorio;
    });

    const obj = await {
      partes: partesContent,
      dadosCartorio: dadosCartorioContent,
    };

    page.close();
    return obj;

  } catch (error) {
    console.log('Portal Censec =>', error);
    const message = {
      status: 500,
      error: error.message
    }
    if (typeof page !== 'undefined') {
      page.close();
    }
    return message;
  }
};
