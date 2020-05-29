#!/usr/bin/env node
const yargs = require("yargs");
const jestTools = require("../src/jestTools");
const simulator = require("../src/simulator");

const argv = yargs
  .command("jestPrompt", "running test promp for jest", () => {
    console.log("running jestPrompt...");
    jestTools.runPrompt();
  })
  .command("simulatorPrompt", "running simulator promp", () => {
    simulator.Prompt();
  })
  .help().argv;
