import { IPlugin, IPluginData } from "./types";


/**
 * A helper to make plugins. Provide is a function that takes the screen and
 * settings and calls the callback with the data. The helper will insert the
 * data, the settings used, and the name of the plugin into the final data object.
 * @param type The name of the plugin to be inserted into the data object.
 * @param inputParam The plugin function that collects data and calls the
 * callback function with it.
 */
export function makePlugin<T>(
  type: string,
  inputParam: (
    screen: HTMLElement,
    config: T,
    callback: (data: IPluginData['output']) => void
  ) => void
): IPlugin<T> {
  return function(config: T) {
    return async function(screen: HTMLElement) {
      const output = await new Promise(resolve => {
        inputParam(screen, config, resolve);
      });
      return { type, input: config, output };
    };
  };
}
