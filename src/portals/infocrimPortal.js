/*jshint esversion: 9, node: true */

(function() {
  'use strict';

  const parse = require('../libs/parseObject.js');
  const chrome = require('../libs/getChrome.js');

  /**
   * @constant
   * @default
   * @type {string}
   */
  const infocrim = 'http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arpensp/pagina4-resultado.html?tipo_registro=N%2CTN&numero_processo=&vara_juiz_id=0&outra_vara=&uf=0&cidade_id=0&cartorio_id=0&flag_conjuge=TD&nome_registrado=&cpf_registrado=&nome_pai=&nome_mae=&data_ocorrido_ini=&data_ocorrido_fim=&data_registro_ini=&data_registro_fim=&num_livro=&num_folha=&num_registro=&btn_pesquisar=Pesquisar';

  /**
   * @async
   * @module cadespPortal
   * @returns {Object}
   */
  module.exports = async function infocrimPortal() {

    try {

      const instances = await chrome.chromeInstance(infocrim);

      const page = instances[0];

      await page.goto('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/infocrim/pagina4-detalhes-bo.html', {
        waitUntil: 'load'
      });

      const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter',
        PreferCSSPageSize: true,
      });

      await chrome.savePdf(pdf, 'infocrim', 'Infocrim - ');


    } catch (error) {
      console.log('Portal Arpenp =>', error);
      if (typeof page !== 'undefined') {
        page.close();
      }
    }
  };

}());
