import prompts from "prompts";

const welcomePrompt = async () => {
  // welcome message
  // prompts [new, prev, exit]
  const choices = [
    {title: "New", value: "new"},
    {title: "Exit", value: "exit"}
  ];
  const {selected} = await prompts([
    {
      type: "select",
      name: "selected",
      message: "Select a command:",
      choices,
      initial: 0,
    }
  ]) || {selected: "error"};
  return selected;
}

const runPrompts = async () => {
  let error = false;
  try {
    await welcomePrompt();
  } catch (err) {
    error = true
    console.trace("prompts error:", err);
  }
  return {error}
}

export default {
  prompts: runPrompts
}
