const router = require('express').Router();
const dbService = require('../service/dbService.js');
const response = require('../model/responseModel.js').responseModel;
const scrapping = require('../service/scrappingService.js');

router.get('/search', async function(req, res) {
  response.status = 200;

  let objeto = {
    user: req.query.user,
    key: req.query.key,
    cpf: req.query.cpf,
    rg: req.query.rg
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
          Pessoa: dbService.searchPerson(keys),
          Rg: dbService.searchRG(keys),
          Cnh: dbService.searchCNH(keys),
          Conta: dbService.searchConta(keys),
          Banco: dbService.searchBanco(keys),
          Imoveis: dbService.searchImoveis(keys),
          Endereço: dbService.searchEndereco(keys)
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
            Pessoa: dbService.searchPerson(keys),
            Rg: dbService.searchRG(keys),
            Cnh: dbService.searchCNH(keys),
            Conta: dbService.searchConta(keys),
            Banco: dbService.searchBanco(keys),
            Imoveis: dbService.searchImoveis(keys),
            Endereço: dbService.searchEndereco(keys)
          };
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

        await dbService.insertHistoric("Em Progresso", id, objeto.user);
        scrapping.scrapAll(objeto, id);

        response.data = [{
          Error: "Pesquisa pendente a busca online"
        }];
      }

    }
  } else {

    let obj = {
      Pessoa: dbService.searchPerson(key),
      Rg: dbService.searchRG(key),
      Cnh: dbService.searchCNH(key),
      Conta: dbService.searchConta(key),
      Banco: dbService.searchBanco(key),
      Imoveis: dbService.searchImoveis(key),
      Endereço: dbService.searchEndereco(key)
    };
    response.data = obj;

  }
  res.send(response);

});
router.post('/report', async function(req, res) {
  response.status = 200;
  let ids = req.body.ids;
  let promisses = [];

  ids.forEach(function(id) {
    let re = dbService.getAllFromHistoric(id);
    promisses.push(re);
  });

  Promise.all(promisses).then(function(respo) {
    promisses.forEach(function(value, index) {
      let t = respo[index].splice(respo[index][respo[index].length - 1], 1);
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
