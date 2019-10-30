const chalk = require('chalk');
const npmLock = require('../lib/treat-fields/npm.lock');

const { log } = console;

function verifyFileNotExist() {
  try {
    npmLock.run('.', '.');
    log(`Verify file not exist ${chalk.green('OK')}`);
  } catch (err) {
    log(`Verify file not exist ${chalk.green('ERROR')}`, err);
  }
}

module.exports.verifyFileNotExist = verifyFileNotExist;
