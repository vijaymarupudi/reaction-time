import { IPluginConstructor, IPluginData } from "./types";

export function makePluginConstructor<T>(
  type: string,
  inputParam: (
    screen: HTMLElement,
    config: T,
    callback: (data: IPluginData['output']) => void
  ) => void
): IPluginConstructor<T> {
  return function(config: T) {
    return async function(screen: HTMLElement) {
      const output = await new Promise(resolve => {
        inputParam(screen, config, resolve);
      });
      return { type, input: config, output };
    };
  };
}
