import { makePlugin } from "../../make-plugin";
import { initJsPsych } from 'jspsych/dist/index'
import {
  IJsPsych,
  IJsPsychLegacyPluginClass,
  IJsPsychPluginConfig,
} from "./jspsych-stub";
import { IPlugin } from "../../types";

function resolveDefaults(
  config: Record<string, unknown>,
  jsPsychLegacyPlugin: IJsPsychLegacyPluginClass
) {
  const parameters = jsPsychLegacyPlugin.info.parameters;
  for (const key of Object.keys(parameters)) {
    if (!config[key]) {
      config[key] = parameters[key].default;
    }
  }
}

let jsPsych: IJsPsych = null;

function init(config: any): void {
  if (jsPsych) {
    return;
  }

  jsPsych = <IJsPsych>(initJsPsych(config) as any);
}

interface IJsPsychPlugin extends IPlugin<IJsPsychPluginConfig> {
  init: (config: any) => void;
}


function makeJsDisplayElement(el: HTMLElement): HTMLElement {
  // Visual display
  // doing this to prevent class pollution of the actual screen
  const jsPsychScreen = document.createElement("div");
  el.appendChild(jsPsychScreen);
  jsPsychScreen.classList.add("jspsych-display-element");
  jsPsychScreen.style.height = "100%";
  jsPsychScreen.style.width = "100%";
  jsPsychScreen.innerHTML = `<div class="jspsych-content-wrapper"><div id="jspsych-content" class="jspsych-content"></div></div>`;
  const jsPsychDisplayElement: HTMLElement = jsPsychScreen.querySelector(
    "#jspsych-content"
  );
  jsPsychDisplayElement.style.maxWidth = "unset"; // for compatibility with reaction-time styles
  return jsPsychDisplayElement;
}

const jsPsychPlugin = makePlugin<IJsPsychPluginConfig>(
  "jsPsychPlugin",
  (screen, userConfig, callback) => {
    if (!jsPsych) {
      throw Error(
        "jsPsych plugin not initiated. Please call RT.plugins.jsPsych.init()"
      );
    }

    const jsPsychConfig = { ...userConfig };
    const jsPsychLegacyPluginClass: IJsPsychLegacyPluginClass = jsPsychConfig.type;
    
    resolveDefaults(jsPsychConfig, jsPsychLegacyPluginClass);

    const jsPsychDisplayElement = makeJsDisplayElement(screen);

    jsPsych.getDisplayElement = () => jsPsychDisplayElement;

    const jsPsychPlugin = new jsPsychLegacyPluginClass(jsPsych);

    jsPsych.finishTrial = (data: Record<string, unknown>) => {
      // Do not call this! This breaks the 'held_key' aspect of jsPsych's keyboard listeners
      // -> jsPsych.pluginAPI.reset(document);
      callback(data);
    };
    jsPsychPlugin.trial(jsPsychDisplayElement, jsPsychConfig);
  }
) as IJsPsychPlugin;

jsPsychPlugin.init = init;

export { jsPsychPlugin as jsPsych };
