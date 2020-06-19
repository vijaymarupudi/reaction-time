import { makePlugin } from "./plugin-utils";

const jsPsych = (window as any).jsPsych;

interface IJsPsychLegacyPlugin {
  info: { parameters: { [key: string]: { default: Object } } };
  trial: { (displayElement: HTMLElement, config: Object): void };
}

interface IJsPsychPluginConfig {
  type: string;
  [key: string]: any;
}

function resolveDefaults(
  config: Object,
  jsPsychLegacyPlugin: IJsPsychLegacyPlugin
) {
  const parameters = jsPsychLegacyPlugin.info.parameters;
  for (const [key, value] of Object.entries(parameters)) {
    if (!config[key]) {
      config[key] = (value as any).default;
    }
  }
}

export const jsPsychPlugin = makePlugin<IJsPsychPluginConfig>(
  "jsPsychPlugin",
  (screen, config) => {
    const jsPsychLegacyPlugin: IJsPsychLegacyPlugin =
      jsPsych.plugins[config.type];
    resolveDefaults(config, jsPsychLegacyPlugin);

    // Visual display
    // doing this to prevent class pollution of the actual screen
    const jsPsychScreen = document.createElement("div");
    screen.appendChild(jsPsychScreen);
    jsPsychScreen.classList.add("jspsych-display-element");
    jsPsychScreen.style.height = "100%";
    jsPsychScreen.style.width = "100%";
    jsPsychScreen.innerHTML = `<div class="jspsych-content-wrapper"><div id="jspsych-content" class="jspsych-content"></div></div>`;
    const jsPsychDisplayElement: HTMLElement = jsPsychScreen.querySelector(
      "#jspsych-content"
    );
    jsPsychDisplayElement.style.maxWidth = "unset"; // for compatability with reaction-time-js styles

    return new Promise(resolve => {
      jsPsych.getDisplayElement = () => jsPsychDisplayElement;
      jsPsych.pluginAPI.createKeyboardEventListeners(document);
      jsPsych.pluginAPI.initAudio()
      jsPsych.finishTrial = (...args) => {
        jsPsych.pluginAPI.reset(document);
        resolve(...args);
      };
      jsPsychLegacyPlugin.trial(jsPsychDisplayElement, config);
    });
  }
);
