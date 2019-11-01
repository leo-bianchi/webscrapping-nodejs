const nodemailer = require('nodemailer');
const arispPortal = require('../portals/arispPortal.js');
const arpenpPortal = require('../portals/arpenpPortal.js');
const cadespPortal = require('../portals/cadespPortal.js');
const cagedPortal = require('../portals/cagedPortal.js');
const censecPortal = require('../portals/censecPortal.js');
const detranPortal = require('../portals/detranPortal.js');
const infocrimPortal = require('../portals/infocrimPortal.js');
const jucespPortal = require('../portals/jucespPortal.js');
const sielPortal = require('../portals/sielPortal.js');
const sivecPortal = require('../portals/sivecPortal.js');
const dbService = require('./dbService.js');
const response = require('../model/responseModel.js').responseModel;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'gabriel.madeira@alparservice.com.br',
    pass: 'joao2000'
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function scrapAll(parm, id) {

  let [sivec, cadesp, siel, detran, arpenp, infocrim, censec, arisp, caged, jucesp] = await Promise.all(
    [
      sivecPortal(parm.rg),
      cadespPortal(),
      sielPortal(),
      detranPortal(),
      arpenpPortal(),
      infocrimPortal(),
      censecPortal(),
      arispPortal(),
      cagedPortal(),
      jucespPortal()
    ]);


  if (parm.rg) {
    await dbService.updatePerson(sivec, siel, detran, arpenp, parm.cpf, id);
  } else {
    await dbService.updatePersonNRG(siel, detran, arpenp, parm.cpf, id);
  }

  dbService.updateHistoric(id);


  response.data = await dbService.searchUser(parm.user);

  const mailOptions = {
    from: 'gabriel.madeira@alparservice.com.br',
    to: response.data[0].EMAIL,
    subject: 'Sua consulta foi concluída',
    text: 'Sua consulta ao cpf ' + parm.cpf + ' foi concluida e está disponivel no portal'
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });

}


module.exports = {
  scrapAll: scrapAll
};
