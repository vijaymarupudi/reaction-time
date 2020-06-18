import { IPlugin } from './types'

export function makePlugin<T>(
  type: string,
  inputParam: (screen: HTMLElement, config: T) => Promise<Object>
): IPlugin {
  return function(config: T) {
    return async function(screen: HTMLElement) {
      const output = await inputParam(screen, config);
      return { type, input: config, output }    
    };
  };
}
