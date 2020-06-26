export interface IPluginData {
  input: unknown;
  output: unknown;
  [others: string]: unknown;
}

export interface IPluginInstance {
  (screen: HTMLElement): Promise<IPluginData>;
}

export interface IPlugin<T> {
  (config: T): IPluginInstance;
}
