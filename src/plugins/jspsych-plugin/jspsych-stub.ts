/* eslint-disable @typescript-eslint/no-namespace */
export interface IJsPsych {
  plugins: { [key: string]: IJsPsychLegacyPlugin };
  getDisplayElement(): Element;
  getDisplayContainerElement(): Element
  webaudio_context: unknown;
  finishTrial(data: Record<string, unknown>): void;
  pluginAPI: any;
  DOM_container?: HTMLElement;
  DOM_target?: HTMLElement;
}

export interface IJsPsychLegacyPlugin {
  trial: {
    (displayElement: HTMLElement, config: Record<string, unknown>): void;
  };
}

export interface IJsPsychLegacyPluginClass {
  info: {
    name: string,
    parameters: { [key: string]: { default: unknown } }
  };
  new(jsPsych: IJsPsych): IJsPsychLegacyPlugin;
}

export interface IJsPsychPluginConfig {
  type: any;
  css_classes?: Array<string>;
  [key: string]: unknown;
}

export interface IPluginAPI {
  createKeyboardEventListeners(el: Document): void;
  reset(el: Document): void;
  audioContext: () => any;
  setTimeout(handler: (...args: any[]) => void, timeout: number, ...args: any[]): void;
}


