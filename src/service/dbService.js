const db = require("../libs/conn.js");

 function selectHistoric(parm) {

     return new Promise(function(resolve) {
        let response = [];

        db.select("SELECT P.ID_PESSOA, NOME_COMPLETO, CPF, PESQUISA_STATUS FROM tb_historicos h JOIN tb_pessoa_fisica p ON (h.id_pessoa = p.id_pessoa) LEFT JOIN tb_rg R ON (p.ID_PESSOA = r.ID_RG_PESSOA) WHERE H.ID_USUARIO = "+parm.user+" AND (P.ID_PESSOA = "+parm.key+" OR P.CPF ="+parm.cpf+" OR R.NUMERO_RG = '"+parm.rg+"')", function (rows) {
            response = rows;
            resolve(response);
        });
     });
}
function selectAllHistoric(id) {
    return new Promise(function(resolve) {
       let response = [];

       db.select("SELECT P.ID_PESSOA, CPF, PESQUISA_STATUS, NOME_COMPLETO FROM TB_HISTORICOS h LEFT JOIN TB_PESSOA_FISICA p ON (h.id_pessoa = p.id_pessoa) WHERE  ID_USUARIO ="+id, function (rows) {
           response = rows;
           resolve(response);
       });
    });
}
function getAllFromHistoric(id){
    return new Promise(function(resolve) {
        let response = [];

        db.select("call Tabelas2GET("+id+")", function (rows) {
            response = rows;
            resolve(response);
        });
     });
}

function getFields(){
    return new Promise(function(resolve) {
        let response = [];

        db.select("call ColumnsGET()", function (rows) {
            response = rows;
            resolve(response);
        });
     });
}

function searchPersonCPForRG(parm){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT * FROM tb_pessoa_fisica P  LEFT JOIN tb_rg R ON (p.ID_PESSOA = r.ID_RG_PESSOA) WHERE P.CPF ='"+ parm.cpf+"' OR R.NUMERO_RG ='"+parm.rg+"'", function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
function searchPerson(id){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT * FROM tb_pessoa_fisica WHERE id_pessoa="+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function searchRG(id){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT * FROM TB_RG WHERE ID_RG_PESSOA ="+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function searchCNH(id){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT * FROM TB_CNH WHERE ID_CNH_PESSOA ="+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function searchConta(id){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT C.ID_CONTA_BANCARIA, C.NUM_CONTA, C.NUM_AGENCIA, C.ID_PESSOA, C.ID_BANCO FROM TB_CONTAS_BANCARIAS C INNER JOIN TB_PESSOA_FISICA P ON (C.ID_PESSOA = P.ID_PESSOA) WHERE P.ID_PESSOA ="+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function searchBanco(id){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT B.ID_BANCO, B.NOME, B.COD_BANCO FROM TB_BANCOS B INNER JOIN TB_CONTAS_BANCARIAS C ON (B.ID_BANCO = C.ID_BANCO) INNER JOIN TB_PESSOA_FISICA P ON (P.ID_PESSOA = C.ID_PESSOA) WHERE P.ID_PESSOA ="+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function searchImoveis(id){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT I.ID_IMOVEL, I.RGI, I.ESCRITURA, I.MATRICULA, I.AREA, I.PERIMETRO, I.VALOR, I.ID_PESSOA, I.ID_ENDERECO FROM TB_IMOVEIS I INNER JOIN TB_PESSOA_FISICA P ON (P.ID_PESSOA = I.ID_PESSOA) WHERE P.ID_PESSOA ="+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function searchEndereco(id){
    return new Promise(function(resolve) {
        let response = [];
        db.select("SELECT E.ID_ENDERECO, E.ENDERECO, E.LOGADOURO, E.NUMERO, E.COMPLEMENTO, E.CEP, E.BAIRRO, E.CIDADE, E.ESTADO, E.LATITUDE, E.LONGITUDE FROM TB_ENDERECOS E INNER JOIN TB_IMOVEIS I ON(I.ID_ENDERECO = E.ID_ENDERECO) INNER JOIN TB_PESSOA_FISICA P ON(P.ID_PESSOA = I.ID_PESSOA) WHERE P.ID_PESSOA ="+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function insertHistoric(status, id, user){
    return new Promise(function(resolve) {
        let response = [];

        db.insert("INSERT INTO tb_historicos (PESQUISA_STATUS, ID_PESSOA, ID_USUARIO) values ('"+status+"',"+id+","+user+")", function (rows) {
            response = "1 linha inserida";
            resolve(response);
        });
     });
  }
  function insertPerson(cpf){
    return new Promise(function(resolve) {
        let response = [];
        db.insert("INSERT INTO tb_pessoa_fisica (CPF) values ("+cpf+")", function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function updateHistoric(id){
    return new Promise(function(resolve) {
        let response = [];
        db.insert("UPDATE tb_historicos SET pesquisa_status = 'Concluido' WHERE ID_PESSOA = "+id, function (rows) {
            response = rows;
            resolve(response);
        });
     });
  }
  function updatePerson(obj, cadesp, cpf, id ){

    let aux = obj[2].value.split('/');
    let data = aux[2]+"-"+aux[1]+"-"+aux[0];
    aux = obj[10].value;
    let naturalizado;
    if(aux == "Sim"){
        naturalizado = true;
    } else{
        naturalizado = false;
    }
     let aux2 = cadesp[3].value.split(/(\d)/);

     let data2 = aux2[9]+aux2[11]+aux2[13]+aux2[15]+"-"+aux2[5]+aux2[7]+"-"+aux2[1]+aux2[3];
    return new Promise(function(resolve) {
        let response = [];
        db.insert("CALL PessoaFisicaPOST('"+obj[0].value+"','"+obj[1].value+"','"+data+"',NULL,'"+obj[9].value+"',"+naturalizado+",'"+cpf+"',NULL,'"+obj[8].value+"','"+obj[12].value+"','"+obj[13].value+"','"+obj[14].value+"','"+obj[16].value+"','"+obj[15].value+"','"+obj[17].value+"','"+obj[18].value+"','"+obj[19].value+"',FALSE,FALSE,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,"+id+")", function (rows) {
            response += rows;

        });
        db.insert("INSERT INTO TB_CNPJ(CNPJ,IE,SITUACAO,DATA_INSCRICAO_ESTADO,NOME_EMPRESARIAL,REGIME_ESTADUAL,DRT,POSTO_FISCAL) VALUES('"+cadesp[2].value+"','"+cadesp[0].value+"', '"+cadesp[1].value+"', '"+data2+"', '"+cadesp[4].value+"','"+cadesp[5].value+"', '"+cadesp[6].value+"', '"+cadesp[7].value+"')", function(rows){
            response += rows;
        });
        resolve(response);
     });

  }
  function validateLogin(user) {
    return new Promise(function(resolve) {
       let response = [];

       db.select("SELECT ID_USUARIO FROM tb_usuarios WHERE USERNAME = '"+ user.login + "' AND SENHA='"+ user.password+"'", function (rows) {
           response = rows;
           resolve(response);
       });

    });

}
function searchUser(user) {
    return new Promise(function(resolve) {
       let response = [];

       db.select("SELECT EMAIL FROM tb_usuarios WHERE ID_USUARIO ="+user, function (rows) {
           response = rows;
           resolve(response);
       });
    });
}



module.exports = {
    selectHistoric: selectHistoric,
    searchPerson: searchPerson,
    searchRG: searchRG,
    searchCNH: searchCNH,
    searchConta: searchConta,
    searchBanco: searchBanco,
    searchImoveis: searchImoveis,
    searchEndereco: searchEndereco,
    searchPersonCPForRG: searchPersonCPForRG,
    insertHistoric: insertHistoric,
    insertPerson: insertPerson,
    selectAllHistoric: selectAllHistoric,
    updatePerson: updatePerson,
    updateHistoric: updateHistoric,
    getAllFromHistoric: getAllFromHistoric,
    validateLogin: validateLogin,
    getFields: getFields,
    searchUser: searchUser
};
