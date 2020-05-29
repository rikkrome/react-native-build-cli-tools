const chalk = require('chalk');
const { exec } = require("child_process");
var path = require('path')

const execCommand = (command) => {
  return new Promise(async (resolve, reject) => {
    try {
      exec(command, {cwd: process.cwd()},
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