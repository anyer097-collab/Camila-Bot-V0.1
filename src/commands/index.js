const admin = require('./admin');
const rpg = require('./rpg');
const economy = require('./economy');
const download = require('./download');
const calculator = require('./calculator');
// Puedes añadir más módulos aquí (hasta 70 comandos)

function registerAll(bot) {
  admin.register(bot);
  rpg.register(bot);
  economy.register(bot);
  download.register(bot);
  calculator.register(bot);
  // registra otros módulos aquí
}

module.exports = { registerAll };
