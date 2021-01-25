#!/usr/bin/env node
const yargs = require("yargs");
const {cli} = require("../dist/index")

const argv = yargs
  .command("*", "running simulator promp", () => {
    cli.prompts();
  })
  .help().argv;
