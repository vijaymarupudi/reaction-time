// import "../jsPsych/jspsych";
// import "../jsPsych/plugins/jspsych-html-button-response.js";
// import "../jsPsych/css/jspsych.css"
import { IPlugin } from "./types";

const jsPsych = (window as any).jsPsych;

function resolveDefaults(config, jsPsychLegacyPlugin) {
  const parameters = jsPsychLegacyPlugin.info.parameters;
  for (const [key, value] of Object.entries(parameters)) {
    if (!config[key]) {
      config[key] = (value as any).default;
    }
  }
}

const PAGE_STYLES = "margin: 0px; height: 100%; width: 100%"

export const jsPsychPlugin: IPlugin = (config: { type: string }) => {
  const jsPsychLegacyPlugin = jsPsych.plugins[config.type];
  resolveDefaults(config, jsPsychLegacyPlugin);
  return function(screen) {
    const htmlTag = document.querySelector('html')
    const parentContainers = [htmlTag, document.body, screen]
    parentContainers.forEach(el => el.setAttribute('style', PAGE_STYLES))
    screen.classList.add("jspsych-display-element");
    screen.innerHTML = `<div class="jspsych-content-wrapper"><div id="jspsych-content" class="jspsych-content"></div></div>`;
    const jsPsychDisplayElement = screen.querySelector("#jspsych-content");
    return new Promise(resolve => {
      jsPsych.getDisplayElement = () => jsPsychDisplayElement;
      jsPsych.finishTrial = data => {
        screen.classList.remove("jspsych-display-element");
        parentContainers.forEach(el => el.setAttribute('style', ''))
        resolve(data);
      };
      jsPsychLegacyPlugin.trial(jsPsychDisplayElement, config);
    });
  };
};
