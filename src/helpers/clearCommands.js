const path = require('path');
const COMMANDS_FILE_PATH = path.join(__dirname, '../logs/deviceList.txt');
const writeToFile = require('../utils/writeToFile');

const clearCommands = async () => {
  try {
    await writeToFile(COMMANDS_FILE_PATH, JSON.stringify({}))
    return;
  } catch (error) {
    console.log('error: ', error)
  }
}
module.exports = clearCommands;