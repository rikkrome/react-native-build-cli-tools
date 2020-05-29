const path = require('path');
const COMMANDS_FILE_PATH = path.join(__dirname, '../logs/deviceList.txt');
const getPreviousCommands = require('./getPreviousCommands');
const writeToFile = require('../utils/writeToFile');

const saveCommand = async ({ key, command }) => {
  try {
    const commands = await getPreviousCommands();
    commands[key] = { key, command, timestamp: new Date().toISOString() };
    await writeToFile(COMMANDS_FILE_PATH, JSON.stringify(commands))
    return;
  } catch (error) {
    console.log('error: ', error)
  }
}
module.exports = saveCommand;