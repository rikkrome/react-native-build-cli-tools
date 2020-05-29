const prompts = require("prompts");
const { exec } = require("child_process");
const ora = require('ora');
const chalk = require('chalk');
const saveCommand = require('../helpers/saveCommand');
const execCommand = require('../utils/execCommand');


//     "android:prod":            "ENVFILE=.env.prod react-native run-android --variant=prodDebug",
//     "android:prod:standalone": "ENVFILE=.env.prod react-native run-android --variant=prodRelease",
//     "android:stage":           "ENVFILE=.env.stage react-native run-android --variant=stageDebug",
//     "android:stage:standalone":"ENVFILE=.env.stage react-native run-android --variant=stageRelease",
//     "a:m": "npm run bundle-android && ENVFILE=.env react-native run-android --variant=masterDebug",
//     "build:android:release": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle && cd android && ENVFILE=.env.release BUILD_NUMBER=166 BUILD_NAME=2.6.0 ./gradlew assembleProdRelease && cd ..",
//     "b:a:m": "npm run bundle-android && cd android && ./gradlew assembleMasterRelease && cd ..",

const build = async ({ env, debug, variant }) => {
  let spinner = ora({ text: `Building Android ${env} ${variant}\n`, spinner: 'bouncingBar', color: 'green' })
  try {
    if(!env && !variant){
      return;
    }
    spinner.start()
    const _debugKey = debug ? 'debug' : 'standalone'
    const key = `Android-${env}-${_debugKey}`;
    const envfile = env ? `.env.${env}` : `.env`
    const command = `ENVFILE=${envfile} react-native run-android --variant=${variant}`
    await saveCommand({ key, command })
    const build = await execCommand(command)
    const { error } = build || {};
    const symbol = error ? '⚠️ ' : `${chalk.green('✔')}`
    const tip = error ? `💡 ${chalk.yellow('Try uninstalling the app')}` : ''
    spinner.stopAndPersist({ symbol, text: `Building Android ${env} ${_debugKey}\n${tip}` });
  } catch (error) {
    console.log('🚫 error', error)
    spinner.stop()
  }
}

const Prompt = async ({ env, debug, variant }) => {
  try {
    if(!env && !variant){
      return;
    }
    // let device;
    // device = await androidDevices();
    // if (!device) {
    //   return;
    // }
    await build({ env, debug, variant })
    return
  } catch (error) {
    console.log('🚫 error', error)
  }
}

module.exports = Prompt;