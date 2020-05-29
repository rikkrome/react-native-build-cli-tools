const prompts = require("prompts");
const ora = require('ora');
const chalk = require('chalk');
const sort = require('./utils/sort');
const iosPrompt = require('./ios/index');
const androidPrompt = require('./android/index')
const execCommand = require('./utils/execCommand');
const saveCommand = require('./helpers/saveCommand');
const clearCommands = require('./helpers/clearCommands');
const getPreviousCommands = require('./helpers/getPreviousCommands');

const OSPrompt = async () => {
  const response = await prompts([
    {
      type: "select",
      name: "os",
      message: "Select device type",
      choices: [
        { title: "iOS", value: "ios" },
        { title: "Android", value: "android" }
      ],
      initial: 0
    }
  ]);
  const { os } = response || {};
  return os
}

const envPrompt = async ({ os }) => {

  const choices = os === 'ios' ? [
    { title: "PROD-Debug 'debug tools'", value: { env: "prod", debug: true, variant: 'prodDebug' } },
    { title: "STAGE-Debug 'debug tools'", value: { env: "stage", debug: true, variant: 'stageDebug' } },
    { title: "PROD-Release 'standalone'", value: { env: "prod", debug: false, variant: 'prodRelease' } },
    { title: "STAGE-Release 'standalone'", value: { env: "stage", debug: false, variant: 'stageRelease' } }
  ] :
  [
    { title: "PROD-Debug 'debug tools'", value: { env: "prod", debug: true, variant: 'prodDebug' } },
    { title: "STAGE-Debug 'debug tools'", value: { env: "stage", debug: true, variant: 'stageDebug' } },
    { title: "PROD-Release 'standalone'", value: { env: "prod", debug: false, variant: 'prodRelease' } },
    { title: "STAGE-Release 'standalone'", value: { env: "stage", debug: false, variant: 'stageRelease' } },
    { title: "Master-Release 'standalone'", value: { env: "", debug: false, variant: 'masterRelease' } }

  ];
  const response = await prompts([
    {
      type: "select",
      name: "env",
      message: "Select environment",
      choices,
      initial: 0
    }
  ]);
  const { env } = response || {};
  return env
}

const formatPreviousCommands = async () => {
  const choices = [];
  const commands = await getPreviousCommands();
  if (commands && typeof commands === 'object') {
    const sortedCommands = sort.objectValues({ data: commands, key: 'timestamp' })
    sortedCommands.forEach(item => {
      const { key, command } = item || {}
      const value = {
        key,
        command,
      }
      choices.push({ title: key, value })
    })
  }
  return choices;
}

exports.Prompt = async () => {
  try {
    const commands = await formatPreviousCommands();
    let initial = commands.length > 0 ? 1 : 0;
    const choices = initial ? [
      { title: "New", value: "new" },
      ...commands,
      { title: "Clear All Commands", value: "clear" },
      { title: "Exit", value: "exit" },
    ] : [
      { title: "New Simulator", value: "new" },
      { title: "Exit", value: "exit" },
    ];

    const newResponse = await prompts([
      {
        type: "select",
        name: "new_prev",
        message: "Select command",
        choices,
        initial,
      }
    ]);
    const { new_prev } = newResponse || {};
    if (new_prev === 'exit') {
      console.log(chalk.bold.blue('\n\tBye ✌️\n'))
      return;
    }
    if (new_prev === 'new') {
      const os = await OSPrompt();
      const { env, debug, variant } = await envPrompt({ os }) || {};
      if (os === 'android') {
        await androidPrompt({ env, debug, variant })
        return;
      }
      if (os === 'ios') {
        await iosPrompt({ env, debug })
        return;
      }
    } else if (new_prev === 'clear') {
      const spinner = ora({ text: `Clearing commands...`, spinner: 'bouncingBar', color: 'green' })
      spinner.start()
      await clearCommands();
      spinner.stopAndPersist({ symbol: `${chalk.green('✔')}`, text: `Cleared commands` });

    }
    else if (new_prev) {
      const { key, command } = new_prev || {}
      if(!key || !command){
        return;
      }
      const spinner = ora({ text: `Building ${key}\n`, spinner: 'bouncingBar', color: 'green' })
      spinner.start()
      const build = await execCommand(command)
      const { error } = build || {};
      const tip = error && os === 'android' ? `💡 ${chalk.yellow('Try uninstalling the app')}` : '';
      const symbol = error ? '⚠️ ' : `${chalk.green('✔')}`
      await saveCommand({ key, command })
      spinner.stopAndPersist({ symbol, text: `Building ${chalk.green(key)}\n${tip}` });
      return;
    }

  } catch (error) {
    console.log('🚫 error', error)
  }
}