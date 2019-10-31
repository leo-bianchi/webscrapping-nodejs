const db = require("../libs/conn.js");

function selectHistoric(parm) {

  return new Promise(function(resolve) {
    var response = [];
    var query = createHistoricQuery(parm);

    db.select(query, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function selectAllHistoric(id) {
  return new Promise(function(resolve) {
    let response = [];

    db.select("SELECT P.ID_PESSOA, CPF, PESQUISA_STATUS, NOME_COMPLETO FROM TB_HISTORICOS h LEFT JOIN TB_PESSOA_FISICA p ON (h.id_pessoa = p.id_pessoa) WHERE  ID_USUARIO =" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function getAllFromHistoric(id) {


  return new Promise(function(resolve) {
    let response = [];

    db.select("call Tabelas2GET(" + id + ")", function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function getFields() {
  return new Promise(function(resolve) {
    let response = [];

    db.select("call ColumnsGET()", function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchPersonCPForRG(parm) {
  return new Promise(function(resolve) {
    var response = [];
    var query = "SELECT * FROM tb_pessoa_fisica P  LEFT JOIN tb_rg R ON (p.ID_PESSOA = r.ID_RG_PESSOA) WHERE ";
    if (parm.cpf)
      query += "P.CPF =" + parm.cpf;

    if (parm.cpf && parm.rg)
      query += " OR ";

    if (parm.rg)
      query += "R.NUMERO_RG ='" + parm.rg + "'";

    db.select(query, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchPerson(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.select("SELECT * FROM tb_pessoa_fisica WHERE id_pessoa=" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchRG(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.select("SELECT * FROM TB_RG WHERE ID_RG_PESSOA =" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchCNH(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.select("SELECT * FROM TB_CNH WHERE ID_CNH_PESSOA =" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchConta(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.select("SELECT C.ID_CONTA_BANCARIA, C.NUM_CONTA, C.NUM_AGENCIA, C.ID_PESSOA, C.ID_BANCO FROM TB_CONTAS_BANCARIAS C INNER JOIN TB_PESSOA_FISICA P ON (C.ID_PESSOA = P.ID_PESSOA) WHERE P.ID_PESSOA =" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchBanco(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.select("SELECT B.ID_BANCO, B.NOME, B.COD_BANCO FROM TB_BANCOS B INNER JOIN TB_CONTAS_BANCARIAS C ON (B.ID_BANCO = C.ID_BANCO) INNER JOIN TB_PESSOA_FISICA P ON (P.ID_PESSOA = C.ID_PESSOA) WHERE P.ID_PESSOA =" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchImoveis(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.select("SELECT I.ID_IMOVEL, I.RGI, I.ESCRITURA, I.MATRICULA, I.AREA, I.PERIMETRO, I.VALOR, I.ID_PESSOA, I.ID_ENDERECO FROM TB_IMOVEIS I INNER JOIN TB_PESSOA_FISICA P ON (P.ID_PESSOA = I.ID_PESSOA) WHERE P.ID_PESSOA =" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function searchEndereco(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.select("SELECT E.ID_ENDERECO, E.ENDERECO, E.LOGADOURO, E.NUMERO, E.COMPLEMENTO, E.CEP, E.BAIRRO, E.CIDADE, E.ESTADO, E.LATITUDE, E.LONGITUDE FROM TB_ENDERECOS E INNER JOIN TB_IMOVEIS I ON(I.ID_ENDERECO = E.ID_ENDERECO) INNER JOIN TB_PESSOA_FISICA P ON(P.ID_PESSOA = I.ID_PESSOA) WHERE P.ID_PESSOA =" + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function insertHistoric(status, id, user) {
  return new Promise(function(resolve) {
    let response = [];

    db.insert("INSERT INTO tb_historicos (PESQUISA_STATUS, ID_PESSOA, ID_USUARIO) values ('" + status + "'," + id + "," + user + ")", function(rows) {
      response = "1 linha inserida";
      resolve(response);
    });
  });
}

function insertPerson(cpf) {
  return new Promise(function(resolve) {
    let response = [];
    db.insert("INSERT INTO tb_pessoa_fisica (CPF) values (" + cpf + ")", function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function updateHistoric(id) {
  return new Promise(function(resolve) {
    let response = [];
    db.insert("UPDATE tb_historicos SET pesquisa_status = 'Concluido' WHERE ID_PESSOA = " + id, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function updatePerson(siel, detran, cpf, id) {
  return new Promise(function(resolve) {
    let response = [];
    resolve(response);
  });

}

function validateLogin(user) {
  return new Promise(function(resolve) {
    let response = [];

    db.select("SELECT ID_USUARIO FROM tb_usuarios WHERE USERNAME = '" + user.login + "' AND SENHA='" + user.password + "'", function(rows) {
      response = rows;
      resolve(response);
    });

  });

}

function searchUser(user) {
  return new Promise(function(resolve) {
    let response = [];

    db.select("SELECT EMAIL FROM tb_usuarios WHERE ID_USUARIO =" + user, function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function insertPersonRG(id, rg) {
  return new Promise(function(resolve) {
    db.select("call RgPOST(" + id + ",'" + rg + "')", function(rows) {
      response = rows;
      resolve(response);
    });
  });
}

function createHistoricQuery(parm) {
  var query = "SELECT P.ID_PESSOA, NOME_COMPLETO, CPF, PESQUISA_STATUS FROM tb_historicos h JOIN tb_pessoa_fisica p ON (h.id_pessoa = p.id_pessoa)";

  if (parm.rg)
    query += " LEFT JOIN tb_rg R ON (p.ID_PESSOA = r.ID_RG_PESSOA)";

  query += " WHERE H.ID_USUARIO = " + parm.user + " AND (";

  if (parm.key)
    query += " P.ID_PESSOA = " + parm.key;

  if ((parm.key && parm.rg) || (parm.key && parm.cpf))
    query += " OR";

  if (parm.cpf)
    query += " P.CPF =" + parm.cpf;

  if (parm.cpf && parm.rg)
    query += " OR";
  if (parm.rg)
    query += " R.NUMERO_RG = '" + parm.rg + "'";

  query += ")";

  return query;

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
  searchUser: searchUser,
  insertPersonRG: insertPersonRG
};
