const parse = require('../libs/parseObject.js');
const chrome = require('../libs/getChrome.js');

/**
 * @constant
 * @default
 * @type {string}
 */
const cadesp = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/cadesp/login.html';

/**
 * @async
 * @module sivecPortal
 * @returns {Object}
 */
module.exports = async function cadespPortal() {

  const instances = await chrome.chromeInstance(cadesp);

  const page = instances[0];

  try {

    await page.waitForSelector('input[type=submit]');

    await page.$eval('#ctlS00_conteudoPaginaPlaceHolder_loginControl_UserName', el => el.value = 'a');

    await page.$eval('#ctl00_conteudoPaginaPlaceHolder_loginControl_Password', el => el.value = 'a');

    await page.click('.botao');

    await page.goto('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/cadesp/pagina3-pesquisa.html');

    await page.waitForSelector('input[type=submit]');

    await page.select('#ctl00_conteudoPaginaPlaceHolder_tcConsultaCompleta_TabPanel1_lstIdentificacao', '2');

    await page.$eval('#ctl00_conteudoPaginaPlaceHolder_tcConsultaCompleta_TabPanel1_txtIdentificacao',
      el => el.value = 'teste');

    await page.click('#ctl00_conteudoPaginaPlaceHolder_tcConsultaCompleta_TabPanel1_btnConsultarEstabelecimento');

    await page.waitForSelector('table');

    const label = await chrome
      .evaluateData(page, 'table#ctl00_conteudoPaginaPlaceHolder_dlCabecalho .labelDetalhe');

    const data = await chrome
      .evaluateData(page, 'table#ctl00_conteudoPaginaPlaceHolder_dlCabecalho .dadoDetalhe');

    await page.close();

    const newData = await data.filter(Boolean);

    const newLabel = await label.filter(Boolean);

    const newArray = await parseArray(newData, newLabel);

    const obj = await parse.toObject(newArray);

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
    return message;
  }
};

/**
  @function
  @returns {Array}
  @param {string} _data
  @param {string} _label
*/
function parseArray(_data, _label) {
  let _array = [];
  for (let i = 0; i < _data.length; i++) {
    _array.push(_label[i]);
    _array.push(_data[i]);
  }
  return _array;
}
