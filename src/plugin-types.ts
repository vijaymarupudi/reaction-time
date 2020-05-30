import * as React from "react";
import { ITrialData } from './types'

export type IReactPluginComponent<T> = React.FunctionComponent<{
  config: T;
  finishTrial: { (trialData: ITrialData): void };
}>;


