//jshint esversion: 8

const router = require('express').Router();
const db_service = require('../service/dbService');
const parse = require('../libs/parseObject.js');
const response = require('../model/responseModel').responseModel;
const scrapping = require('../service/scrappingService');

router.get('/search', async function(req, res) {
  response.status = 200;

  var objeto = {
    user: req.query.user,
    key: req.query.key,
    cpf: req.query.cpf,
    rg: req.query.rg
  };
  var type = req.query.type;
  var key = objeto.key;
  var cpf = objeto.cpf;
  var user = objeto.user;


  if (type == 'doc') {
    response.data = await db_service.selectHistoric(objeto);

    if (response.data.length > 0) {

      if (response.data[0].PESQUISA_STATUS == "Concluido") {

        response.data = await db_service.searchPersonCPForRG(objeto);
        var keys = response.data[0].ID_PESSOA;
        var obj = {
          Pessoa: db_service.searchPerson(keys),
          Rg: db_service.searchRG(keys),
          CNH: db_service.searchCNH(keys),
          Conta: db_service.searchConta(keys),
          Banco: db_service.searchBanco(keys),
          Imoveis: db_service.searchImoveis(keys),
          Endereço: db_service.searchEndereco(keys)
        };
        response.data = obj;
      } else if (response.data[0].PESQUISA_STATUS == "Incompleto" || response.data[0].PESQUISA_STATUS == "Falha") {
        response.status = 404;
        response.data = [{
          Error: "Pesquisa incompleta ou com falha"
        }];

      } else {
        response.data = [{
          Error: "Pesquisa pendente"
        }];
      }
    } else {
      response.data = await db_service.searchPersonCPForRG(objeto);
      if (response.data.length > 0) {
        var keys = response.data[0].ID_PESSOA;
        if (response.data[0].NOME_COMPLETO) {
          await db_service.insertHistoric("Concluido", keys, objeto.user);
          var obj = {
            Pessoa: db_service.searchPerson(keys),
            Rg: db_service.searchRG(keys),
            CNH: db_service.searchCNH(keys),
            Conta: db_service.searchConta(keys),
            Banco: db_service.searchBanco(keys),
            Imoveis: db_service.searchImoveis(keys),
            Endereço: db_service.searchEndereco(keys)
          };
          response.data = obj;
        } else {
          await db_service.insertHistoric("Em Progresso", keys, objeto.user);
          response.data = [{
            Error: "Pesquisa em Progresso, usuário sem nome"
          }];
        }
      } else {
        response.data = await db_service.insertPerson(objeto.cpf);
        var id = response.data.insertId;

        await db_service.insertHistoric("Em Progresso", id, objeto.user);
        scrapping.scrapAll(objeto);

        response.data = [{
          Error: "Pesquisa pendente a busca online"
        }];
      }

    }
  } else {

    var obj = {
      Pessoa: db_service.searchPerson(key),
      Rg: db_service.searchRG(key),
      CNH: db_service.searchCNH(key),
      Conta: db_service.searchConta(key),
      Banco: db_service.searchBanco(key),
      Imoveis: db_service.searchImoveis(key),
      Endereço: db_service.searchEndereco(key)
    };
    response.data = obj;

  }
  res.send(response);

});
router.post('/report', async function(req, res) {
  response.status = 200;
  var ids = req.body.ids;
  var promisses = [];

  ids.forEach(function(id) {
    var re = db_service.getAllFromHistoric(id);
    promisses.push(re);
  });

  Promise.all(promisses).then(function(respo) {
    promisses.forEach(function(value, index) {
      var t = respo[index].splice(respo[index][respo[index].length - 1], 1);
      response.data.push(t[0]);
    });
    res.statusCode = response.status;
    res.send(response);
  });


});

router.get('/historic', async function(req, res) {
  response.status = 200;
  var id = req.query.id;
  response.data = await db_service.selectAllHistoric(id);
  res.send(response);

});

router.get('/fields', async function(req, res) {
  response.status = 200;
  response.data = await db_service.getFields();
  res.statusCode = response.status;
  res.send(response);

});


module.exports = router;
