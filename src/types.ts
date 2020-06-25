export interface IPluginData {
  input: unknown;
  output: unknown;
  [others: string]: unknown;
}

export interface IPlugin {
  (screen: HTMLElement): Promise<IPluginData>;
}

export interface IPluginConstructor<T> {
  (config: T): IPlugin;
}
