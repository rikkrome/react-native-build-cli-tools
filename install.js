#!/usr/bin/env node
const { exec } = require("child_process");

const install = () => {
  try {
    exec('npm install && cd ./src/logs && touch deviceList.txt',
      (error, stdout) => {
        if (error !== null) {
          console.log('install error', error);
        } else {
          console.log('CLI __dirname: ', __dirname);
          console.log('CLI installed...', stdout);
        }
      });
  } catch (error) {
    console.log('install error', error);
  }
}

install();