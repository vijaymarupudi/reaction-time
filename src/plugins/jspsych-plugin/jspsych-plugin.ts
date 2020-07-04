import { makePlugin } from "../../make-plugin";
import {
  jsPsych,
  IJsPsychLegacyPlugin,
  IJsPsychPluginConfig,
} from "./jspsych-stub";
import { IPlugin } from "../../types";

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

let jsPsychWebAudioContext: any = null;
let jsPsychInitiated = false;

interface IInitConfig {
  use_webaudio?: boolean;
}

function init(config?: IInitConfig): void {
  if (jsPsychInitiated) {
    return;
  }

  if (!config) {
    config = {};
  }

  if (config.use_webaudio === undefined) {
    config.use_webaudio = true;
  }

  jsPsych.pluginAPI.createKeyboardEventListeners(document);

  jsPsychWebAudioContext = config.use_webaudio
    ? jsPsych.webaudio_context
    : null;

  jsPsych.pluginAPI.audioContext = () => {
    if (jsPsychWebAudioContext !== null) {
      if (jsPsychWebAudioContext.state !== "running") {
        jsPsychWebAudioContext.resume();
      }
    }
    return jsPsychWebAudioContext;
  };

  jsPsychInitiated = true;
}

interface IJsPsychPlugin extends IPlugin<IJsPsychPluginConfig> {
  init: (config: IInitConfig) => void;
}

const jsPsychPlugin = makePlugin<IJsPsychPluginConfig>(
  "jsPsychPlugin",
  (screen, userConfig, callback) => {
    if (!jsPsychInitiated) {
      throw Error(
        "jsPsych plugin not initiated. Please call RT.plugins.jsPsych.init()"
      );
    }

    const jsPsychConfig = { ...userConfig };
    const jsPsychLegacyPlugin: IJsPsychLegacyPlugin =
      jsPsych.plugins[jsPsychConfig.type];
    resolveDefaults(jsPsychConfig, jsPsychLegacyPlugin);

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
    jsPsychDisplayElement.style.maxWidth = "unset"; // for compatibility with reaction-time styles

    jsPsych.getDisplayElement = () => jsPsychDisplayElement;

    jsPsych.finishTrial = (data: Record<string, unknown>) => {
      // Do not call this! This breaks the 'held_key' aspect of jsPsych's keyboard listeners
      // -> jsPsych.pluginAPI.reset(document);
      callback(data);
    };
    jsPsychLegacyPlugin.trial(jsPsychDisplayElement, jsPsychConfig);
  }
) as IJsPsychPlugin;

jsPsychPlugin.init = init;

export { jsPsychPlugin as jsPsych };
