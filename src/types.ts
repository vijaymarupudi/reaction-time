export type ITrialData = Object;

export interface ITrial {
  (screen: HTMLElement): Promise<ITrialData>;
}

export interface IPlugin {
  (config: any): ITrial;
}
