const path = require('path');
const COMMANDS_FILE_PATH = path.join(__dirname, '../logs/deviceList.txt');
const readFile = require('../utils/readFile');

const getPreviousCommands = async () => {
  try {
    const file = await readFile(COMMANDS_FILE_PATH)
    if (file && typeof file === 'string') {
      const commands = JSON.parse(file)
      if (commands && typeof commands === 'object') {
        return commands;
      }
    }
    return {};
  } catch (error) {
    return {};
  }
}
module.exports = getPreviousCommands;