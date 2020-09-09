const pino = require('pino')();

class Logger {

  constructor() {
      if (!Logger.instance) {
          Logger.instance = pino;
      }
  }

  getInstance() {
      return Logger.instance;
  }

}

module.exports = Logger;