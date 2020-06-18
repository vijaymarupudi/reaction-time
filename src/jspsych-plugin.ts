// import "../jsPsych/jspsych";
// import "../jsPsych/plugins/jspsych-html-button-response.js";
// import "../jsPsych/css/jspsych.css"

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

const PAGE_STYLES = "margin: 0px; height: 100%; width: 100%";

export const jsPsychPlugin = makePlugin<IJsPsychPluginConfig>(
  "jsPsychPlugin",
  (screen, config) => {
    const jsPsychLegacyPlugin: IJsPsychLegacyPlugin =
      jsPsych.plugins[config.type];
    resolveDefaults(config, jsPsychLegacyPlugin);
    const htmlTag = document.querySelector("html");
    const parentContainers = [htmlTag, document.body, screen];
    parentContainers.forEach(el => el.setAttribute("style", PAGE_STYLES));
    screen.classList.add("jspsych-display-element");
    screen.innerHTML = `<div class="jspsych-content-wrapper"><div id="jspsych-content" class="jspsych-content"></div></div>`;
    const jsPsychDisplayElement: HTMLElement = screen.querySelector(
      "#jspsych-content"
    );
    return new Promise(resolve => {
      jsPsych.getDisplayElement = () => jsPsychDisplayElement;
      jsPsych.finishTrial = (data: Object) => {
        screen.classList.remove("jspsych-display-element");
        parentContainers.forEach(el => el.setAttribute("style", ""));
        resolve(data);
      };
      jsPsychLegacyPlugin.trial(jsPsychDisplayElement, config);
    });
  }
);
