/*jshint esversion: 9, node: true */

const db = require("../libs/conn.js");
const parse = require('../libs/parseObject.js');

function selectHistoric(id) {
  return new Promise(function(resolve) {
    var response = [];

    db.select("SELECT NOME_COMPLETO, CPF, PESQUISA_STATUS FROM tb_historicos h JOIN tb_pessoa_fisica p ON (h.id_pessoa = p.id_pessoa) WHERE H.ID_USUARIO = " + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function selectPerson(id, type) {
  //metodo pra parse (nao completo)
  //rows.forEach(r => {
  //response.push(parse.buildJson(r));
  // });
}

module.exports = {
  selectHistoric: selectHistoric
};

/*
  método principal que busca pelo rg, cpf
  scrapping service - busca e insere no banco
*/
