const yargs = require("yargs");
const { spawn } = require("child_process");
const prompts = require("prompts");
prompts.override(require("yargs").argv);
const writeToFile = require("./utils/writeToFile");

exports.runPrompt = async () => {
  try {
    const argv = yargs.argv;
    console.log("runPrompt running...");
    console.log("argv: ", argv);
    const writeFile = argv.writeFile || null;
    const response = await prompts([
      {
        type: "select",
        name: "env",
        message: "Select test environment used for all tests.",
        choices: [
          { title: "PROD", value: "prod" },
          { title: "STAGE", value: "stage" }
        ],
        initial: 0
      }
    ]);
    console.log(response);
    const { env } = response || {};

    const jestProcess = spawn("npm", ["run", "jest", `--env=${env}`], {
      stdio: "inherit",
    });

    // process.stdout.on("data", data => {
    //   console.log(`🔴 stdout: ${data}`);
    //   // save to log file
    //   // writeToFile(writeFile, data);
    // });

    jestProcess.on("error", error => {
      console.log(`🔴 error: ${error.message}`);
    });

    jestProcess.on("close", code => {
      console.log(`🔴 child process exited with code ${code}`);
    });
  } catch (error) {
    console.log(`🔴 runPrompt error: ${error}`);
  }
};
