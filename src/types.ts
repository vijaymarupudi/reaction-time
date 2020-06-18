export type ITrialData = {
  input: Object,
  output: Object
};


export interface ITrial {
  (screen: HTMLElement): Promise<ITrialData>;
}

export interface IPlugin {
  (config: any): ITrial;
}
