//  (function() {
//    'use strict';

    const express = require('express');
    const bodyParser = require("body-parser");
    const app = express();
    const port = 3000;

    app.listen(port, () => {
      console.log('Server running on port', port);
    });
    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/api', require('./routes/index'));
    app.use('/auth', require('./routes/login'));
/*
    app.get('/api', (req, res, next) => {
      //console.log(req);
      return {teste: 123};
      //getResult().then((obj) => {
       // res.json(obj);
      //});
      //inserirPessoa('45069106805');
    });

    async function getResult() {
      let obj = sivecPortal();

       let [sivec, cadesp, siel] = await Promise.all(
  [
          sivecPortal(),
          cadespPortal(),
           sielPortal(),
           detranPortal(),
         ]);

      return obj;

      // return [sivec, cadesp];
    }

  }());


  function pesquisarHistorico(id, type){

  db.select('SELECT * FROM tb_historicos WHERE id_usuario='+id, function(rows) {
      if(rows.length > 0){
        var status = rows[0].status;
        if(status == "200"){
          pesquisarTudo();
        }else{
          return status;
        }
      }else{
        pesquisarPessoa(id);
      }
    });
  }

  function pesquisarPessoa(pessoa){
    db.select('SELECT * FROM tb_pessoa_fisica WHERE cpf='+pessoa, function(rows) {
      if(rows.length >0){
        if(rows[0]["NOME_COMPLETO"]){
          db.inserir("INSERT INTO tb_historicos (status, id_usuario) VALUES ('sucesso',"+pessoa+")", function(rows){
          });
          pesquisarTudo();
        }else{
          db.inserir("INSERT INTO tb_historicos (status, id_usuario) VALUES ('pendente',"+pessoa+")", function(rows){
            return "Pendente";
          });
        }
      }else{
        inserirPessoa(pessoa);
      }
    });
  }
  function inserirPessoa(cpf){
    var pessoa;
    this.db.inserir("INSERT INTO tb_pessoa_fisica (cpf) VALUES ("+cpf+")", function(rows){
    });
    db.select("SELECT ID_PESSOA FROM tb_pessoa_fisica WHERE cpf="+cpf, function(rows){
      pessoa = rows[0]
    })

    db.inserir("CALL HistoricosPOST ('Em Progresso', 2, "+pessoa+", null)", function(rows){
    });

/*
    //SCRAPPING
    var dadosScrapping = getResult();
    console.log(dadosScrapping);
    */
//  }
