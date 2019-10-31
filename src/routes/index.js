//jshint esversion: 9

const router = require('express').Router();
const dbService = require('../service/dbService.js');
const response = require('../model/responseModel.js').responseModel;
const scrapping = require('../service/scrappingService.js');

router.get('/search', async function(req, res) {
  response.status = 200;

  let objeto = {
    user: req.query.user || null,
    key: req.query.key || null,
    cpf: req.query.cpf || null,
    rg: req.query.rg || null
  };
  let type = req.query.type;
  let key = objeto.key;
  let cpf = objeto.cpf;
  let user = objeto.user;


  if (type == 'doc') {
    response.data = await dbService.selectHistoric(objeto);

    if (response.data.length > 0) {
      //TEM HISTORICO
      if (response.data[0].PESQUISA_STATUS == "Concluido") {

        response.data = await dbService.searchPersonCPForRG(objeto);
        let keys = response.data[0].ID_PESSOA;
        let obj = {
          Pessoa: await dbService.searchPerson(keys),
          Rg: await dbService.searchRG(keys),
          Cnh: await dbService.searchCNH(keys),
          Conta: await dbService.searchConta(keys),
          Banco: await dbService.searchBanco(keys),
          Imoveis: await dbService.searchImoveis(keys),
          Endereço: await dbService.searchEndereco(keys)
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
      response.data = await dbService.searchPersonCPForRG(objeto);
      if (response.data.length > 0) {
        let keys = response.data[0].ID_PESSOA;
        if (response.data[0].NOME_COMPLETO) {
          await dbService.insertHistoric("Concluido", keys, objeto.user);
          let obj = {
            Pessoa: await dbService.searchPerson(key),
            Rg: await dbService.searchRG(key),
            Cnh: await dbService.searchCNH(key),
            Conta: await dbService.searchConta(key),
            Banco: await dbService.searchBanco(key),
            Imoveis: await dbService.searchImoveis(key),
            Endereço: await dbService.searchEndereco(key)
          }
          response.data = obj;
        } else {
          await dbService.insertHistoric("Em Progresso", keys, objeto.user);
          response.data = [{
            Error: "Pesquisa em Progresso, usuário sem nome"
          }];
        }
      } else {
        response.data = await dbService.insertPerson(objeto.cpf);
        let id = response.data.insertId;

        if (objeto.rg)
          await dbService.insertPersonRG(id, objeto.rg);

        await dbService.insertHistoric("Em Progresso", id, objeto.user);
        scrapping.scrapAll(objeto, id);

        response.data = [{
          Error: "Pesquisa pendente a busca online"
        }];
      }

    }
  } else {

    let obj = {
      Pessoa: await dbService.searchPerson(key),
      Rg: await dbService.searchRG(key),
      Cnh: await dbService.searchCNH(key),
      Conta: await dbService.searchConta(key),
      Banco: await dbService.searchBanco(key),
      Imoveis: await dbService.searchImoveis(key),
      Endereço: await dbService.searchEndereco(key)
    }
    response.data = obj;

  }
  res.send(response);

});
router.post('/report', async function(req, res) {
  response.status = 200;
  var ids = req.body.ids;
  var promisses = [];

  ids.forEach(function(id, index) {
    var re = dbService.getAllFromHistoric(id);
    promisses.push(re);
  });

  response.data = [];

  Promise.all(promisses).then(function(respo) {
    respo.forEach(function(value, index) {
      var t = value;
      response.data.push(t[0]);
    });

    res.statusCode = response.status;
    res.send(response);
  });

});

router.get('/historic', async function(req, res) {
  response.status = 200;
  let id = req.query.id;
  response.data = await dbService.selectAllHistoric(id);
  res.statusCode = response.status;
  res.send(response);

});

router.get('/fields', async function(req, res) {
  response.status = 200;
  response.data = await dbService.getFields();
  res.statusCode = response.status;
  res.send(response);

});


module.exports = router;
