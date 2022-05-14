import { makePlugin } from "../../make-plugin";
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
// I am saving the jsPsychContainer across invocations of this plugin
// because jsPsych expects a single container throughout the
// experiment and performs stateful actions such as installing event
// listeners on them.

// Instead of going through the pain of forking jsPsych, this does the job.
let jsPsychContainer: HTMLElement = null;

function init(userJsPsych: any): void {
  if (jsPsych) {
    return;
  }

  jsPsych = <IJsPsych>(userJsPsych as any);
  jsPsychContainer = document.createElement("div");
  jsPsychContainer.classList.add("jspsych-display-element");
  jsPsychContainer.tabIndex = 0;
  jsPsychContainer.style.height = "100%";
  jsPsychContainer.style.width = "100%";
}

interface IJsPsychPlugin extends IPlugin<IJsPsychPluginConfig> {
  init: (config: any) => void;
}


function makeJsPsychElements(el: HTMLElement): [HTMLElement, HTMLElement] {
  // Visual display
  // doing this to prevent class pollution of the actual screen
  el.appendChild(jsPsychContainer)
  jsPsychContainer.innerHTML = `<div class="jspsych-content-wrapper"><div id="jspsych-content" class="jspsych-content"></div></div>`;
  const jsPsychDisplayElement: HTMLElement = jsPsychContainer.querySelector(
    "#jspsych-content"
  );
  jsPsychDisplayElement.style.maxWidth = "unset"; // for compatibility with reaction-time styles
  return [jsPsychContainer, jsPsychDisplayElement];
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

    const [jsPsychContainer, jsPsychDisplayElement] = makeJsPsychElements(screen);

    const cssClasses: Array<string> = userConfig.css_classes || [];    

    // This makes sure JsPsych's css_classes feature works
    cssClasses.forEach(class_ => {
      jsPsychDisplayElement.classList.add(class_)
    })
    


    jsPsych.DOM_container = jsPsychContainer;
    jsPsych.DOM_target = jsPsychDisplayElement;
    // The lines below don't work because jsPsych binds 'this' using
    // auto-bind on unaccessible objects
    // jsPsych.pluginAPI.getRootElement = () => jsPsychDisplayElement;
    // jsPsych.getDisplayElement = () => jsPsychDisplayElement;
    // jsPsych.getDisplayContainerElement = () => jsPsychDisplayElement;

    jsPsychContainer.focus()

    jsPsych.finishTrial = (data: Record<string, unknown>) => {
      // Do not call this! This breaks the 'held_key' aspect of jsPsych's keyboard listeners
      // -> jsPsych.pluginAPI.reset(document);

      screen.removeChild(jsPsychContainer)

      // This makes sure JsPsych's css_classes feature works
      cssClasses.forEach(class_ => {
        jsPsychDisplayElement.classList.remove(class_)
      });

      if (!data.jsPsychPluginType) {
        data.jsPsychPluginType = jsPsychLegacyPluginClass.info.name;
      }
      
      callback(data);
    };

    const jsPsychPlugin = new jsPsychLegacyPluginClass(jsPsych);
    jsPsychPlugin.trial(jsPsychDisplayElement, jsPsychConfig);
  }
) as IJsPsychPlugin;

jsPsychPlugin.init = init;

export { jsPsychPlugin as jsPsych };
