export interface IJsPsychLegacyPlugin {
  info: { parameters: { [key: string]: { default: unknown } } };
  trial: {
    (displayElement: HTMLElement, config: Record<string, unknown>): void;
  };
}

export interface IJsPsychPluginConfig {
  type: string;
  [key: string]: unknown;
}

interface IPluginAPI {
  createKeyboardEventListeners(el: HTMLDocument): void;
  initAudio(): void;
  reset(el: HTMLDocument): void;
}

/* eslint-disable @typescript-eslint/no-namespace */
interface IJsPsych {
  plugins: { [key: string]: IJsPsychLegacyPlugin };
  getDisplayElement(): Element;
  finishTrial(data: Record<string, unknown>): void;
  pluginAPI: IPluginAPI;
}
/* eslint-enable @typescript-eslint/no-namespace */

declare global {
  interface Window {
    jsPsych: IJsPsych;
  }
}

export const jsPsych: IJsPsych = window.jsPsych;
