const prompts = require("prompts");
const { exec } = require("child_process");
const ora = require('ora');
const chalk = require('chalk');
const saveCommand = require('../helpers/saveCommand');
const execCommand = require('../utils/execCommand');

const formatIOSDevices = (devices) => {
  try {
    if (typeof devices === 'string') {
      const list = devices.split('\n')
      if (list && Array.isArray(list)) {
        const _devices = []
        list.forEach(item => {
          if (item && typeof item === 'string') {
            const iosDevice = item.split(' (');
            if (iosDevice && Array.isArray(iosDevice) && iosDevice[0]) {
              const iosDeviceCheck = item.split(' ');
              if (iosDeviceCheck[0] === 'iPhone') {
                _devices.push({
                  title: `${item}`,
                  value: `${iosDevice[0]}`
                })
              }
            }
          }
        })
        return _devices;
      }
    }
    return []
  } catch (error) {
    console.log(`🚫 getIOSDevices  error: {error}`);
  }
}

const getIOSDevices = () => {
  return new Promise((resolve, reject) => {
    try {
      // instruments -s devices | grep "iPhone" > deviceList.txt
      exec('instruments -s devices | grep "iPhone"',
        function (error, stdout, stderr) {
          if (error !== null) {
            console.log('exec error: ' + error);
          } else {
            let devices = formatIOSDevices(stdout)
            return resolve(devices)
          }
        });
    } catch (error) {
      console.log(`🚫 getIOSDevices  error: {error}`);
    }
  })
}

const iosDevices = async () => {
  const spinner = ora({ text: 'Getting iOS Devices', spinner: 'bouncingBar', color: 'green' })
  spinner.start()
  const devices = await getIOSDevices();
  spinner.stopAndPersist({ symbol: `${chalk.green('✔')}`, text: 'Getting iOS Devices' });
  if (devices && Array.isArray(devices)) {
    const iosResponse = await prompts([
      {
        type: "select",
        name: "ios_sim",
        message: "Select iOS device",
        choices: [
          ...devices
        ],
        initial: 0
      }
    ]);
    const { ios_sim } = iosResponse || {};
    return ios_sim
  }

}

// "sim:11:stage": "ENVFILE=.env.stage react-native run-ios --scheme app-stage --simulator=\"iPhone 11\"",
// "sim:11:standalone": "ENVFILE=.env.prod react-native run-ios --scheme app-prod --simulator=\"iPhone 11\" --configuration Release",
const build = async ({ env, debug, device }) => {
  let spinner;
  try {
    spinner = ora({ text: `Building iOS ${device} ${env}\n`, spinner: 'bouncingBar', color: 'green' })
    spinner.start()
    const configuration = debug ? '' : '--configuration Release'
    const command = `ENVFILE=.env.${env} react-native run-ios --simulator="${device}" ${configuration}`
    const _debugKey = debug ? 'debug' : 'standalone'
    const key = `${device}-${env}-${_debugKey}`;
    await saveCommand({ key, command })
    const build = await execCommand(command)
    const { error } = build || {};
    const symbol = error ? '⚠️ ' : `${chalk.green('✔')}`
    spinner.stopAndPersist({ symbol, text: `Building iOS ${chalk.green(device)} ${chalk.yellow(env)}\n` });
  } catch (error) {
    if (spinner) { spinner.stop(); }
    console.log('🚫 error', error)
  }
  return
}


const Prompt = async ({ env, debug }) => {
  try {
    let device;
    device = await iosDevices();
    if (!device) {
      return;
    }
    await build({ env, debug, device })
    return
  } catch (error) {
    console.log('🚫 error', error)
  }
  return
}

module.exports = Prompt;