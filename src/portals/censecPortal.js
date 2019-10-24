/*jshint esversion: 9, strict: true, node: true */

(function() {
  'use strict';

  const parse = require('../libs/parseObject.js');
  const chrome = require('../libs/getChrome.js');

  /**
   * @constant
   * @default
   * @type {string}
   */
  const siel = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/censec/pagina5-dados.html?__VIEWSTATEGENERATOR=128406E2&__SCROLLPOSITIONX=0&__SCROLLPOSITIONY=512.7999877929688&ctl00%24ContentPlaceHolder1%24NomeTextBox=&ctl00%24ContentPlaceHolder1%24DocumentoTextBox=19.811.201%2F0001-05&ctl00%24ContentPlaceHolder1%24IdentidadeTextBox=&ctl00%24ContentPlaceHolder1%24ComplementoTextBox=&ctl00%24ContentPlaceHolder1%24LivroTextBox=&ctl00%24ContentPlaceHolder1%24FolhaTextBox=&ctl00%24ContentPlaceHolder1%24TipoAtoDropDownList=0&ctl00%24ContentPlaceHolder1%24DataDeTextBox=&ctl00%24ContentPlaceHolder1%24DataAteTextBox=&ctl00%24ContentPlaceHolder1%24UFDropDownList=0&ctl00%24ContentPlaceHolder1%24MunicipioDropDownList=0&ctl00%24ContentPlaceHolder1%24CartorioDropDownList=0&ctl00%24ContentPlaceHolder1%24txtCaptcha=&SelecaoRadio=81448223&ctl00%24ContentPlaceHolder1%24VisualizarButton=Visualizar';

  /**
   * @async
   * @module sivecPortal
   * @returns {Object}
   */
  module.exports = async function censecPortal() {

    try {

      const instances = await chrome.chromeInstance(siel);

      const page = instances[0];

      console.log(inputsValues);
    } catch (error) {
      console.log('Portal Siel =>', error);
      if (typeof page !== 'undefined') {
        page.close();
      }
    }
  };

}());
