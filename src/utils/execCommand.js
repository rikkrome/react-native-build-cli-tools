const chalk = require('chalk');
const { exec } = require("child_process");

const execCommand = (command) => {
  return new Promise(async (resolve, reject) => {
    try {
      // return resolve({ error: false })
      exec(command,
        (error) => {
          if (error !== null) {
            console.log(chalk.red(error));
            return resolve({ error: true })
          } else {
            return resolve({ error: false })
          }
        });
    } catch (error) {

    }
  })
}

module.exports = execCommand;