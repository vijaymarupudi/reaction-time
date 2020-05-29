export interface ITrial {
  (screen: HTMLElement): Promise<Object>;
}

export interface IPlugin {
  (config: any): ITrial;
}

