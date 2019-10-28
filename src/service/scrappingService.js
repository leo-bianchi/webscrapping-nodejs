/* jshint esversion: 9 */

const sivecPortal = require('../portals/sivecPortal.js');
const sielPortal = require('../portals/sielPortal.js');
const cadespPortal = require('../portals/cadespPortal.js');
const detranPortal = require('../portals/detranPortal.js');
const arpenpPortal = require('../portals/arpenpPortal.js');
const infocrimPortal = require('../portals/infocrimPortal.js');
const censecPortal = require('../portals/censecPortal.js');
const cagedPortal = require('../portals/cagedPortal.js');

const db_service = require('./dbService.js');

async function scrapAll( /*parm*/ ) {
  // let obj;
  // if(parm.rg){
  //   var rg = parm.rg;
  //     obj = await sivecPortal(rg);
  // }

  //let obj = cagedPortal();

  let [sivec, cadesp, siel, detran, arpenp, infocrim, censec] = await Promise.all(
    [
      sivecPortal(),
      cadespPortal(),
      sielPortal(),
      detranPortal(),
      arpenpPortal(),
      infocrimPortal(),
      censecPortal()
    ]);

  //return await db_service.updatePerson(obj, parm.cpf, parm.user);

  return obj;

}


module.exports = {
  scrapAll: scrapAll
};
