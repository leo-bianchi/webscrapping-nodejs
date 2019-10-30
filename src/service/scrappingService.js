/*jshint esversion: 8, node: true*/

const nodemailer = require('nodemailer');
const sivecPortal = require('../portals/sivecPortal.js');
const sielPortal = require('../portals/sielPortal.js');
const cadespPortal = require('../portals/cadespPortal.js');
const detranPortal = require('../portals/detranPortal.js');
const arpenpPortal = require('../portals/arpenpPortal.js');
const infocrimPortal = require('../portals/infocrimPortal.js');
const censecPortal = require('../portals/censecPortal.js');
const cagedPortal = require('../portals/cagedPortal.js');
const dbService = require('./dbService.js');
const response = require('../model/responseModel.js').responseModel;
const juscepPortal = require('../portals/juscepPortal.js');

// (async function() {
//   console.log(await getResult());
// })();
//
// async function getResult() {
//   let obj = await detranPortal();
//
//   return obj;
// }

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'gbmadeira27@gmail.com',
    pass: 'joao2000'
  },
  tls: {
    rejectUnauthorized: false
  }
});


async function scrapAll(parm, id) {



  let [sivec, cadesp, siel, detran] = await Promise.all(
    [
      sivecPortal(parm.rg),
      cadespPortal(),
      //         /*sielPortal(),
      //         detranPortal(),
      //         arpenpPortal(),
      //         infocrimPortal(),
      //         censecPortal()*/
    ]);




  await dbService.updatePerson(sivec, cadesp, parm.cpf, id);
  dbService.updateHistoric(id);


  response.data = await dbService.searchUser(parm.user);

  const mailOptions = {
    from: 'gbmadeira27@gmail.com',
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
