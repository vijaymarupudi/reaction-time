import { makePlugin } from "../../make-plugin";
import {
  jsPsych,
  IJsPsychLegacyPlugin,
  IJsPsychPluginConfig
} from "./jspsych-stub";

function resolveDefaults(
  config: Record<string, unknown>,
  jsPsychLegacyPlugin: IJsPsychLegacyPlugin
) {
  const parameters = jsPsychLegacyPlugin.info.parameters;
  for (const key of Object.keys(parameters)) {
    if (!config[key]) {
      config[key] = parameters[key].default;
    }
  }
}

const jsPsychPlugin = makePlugin<IJsPsychPluginConfig>(
  "jsPsychPlugin",
  (screen, config, callback) => {
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
    jsPsychDisplayElement.style.maxWidth = "unset"; // for compatability with reaction-time styles

    jsPsych.getDisplayElement = () => jsPsychDisplayElement;
    jsPsych.pluginAPI.createKeyboardEventListeners(document);
    jsPsych.pluginAPI.initAudio();
    jsPsych.finishTrial = (data: Record<string, unknown>) => {
      jsPsych.pluginAPI.reset(document);
      callback(data);
    };
    jsPsychLegacyPlugin.trial(jsPsychDisplayElement, config);
  }
);

export { jsPsychPlugin as jsPsych };
