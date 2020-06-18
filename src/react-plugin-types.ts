import * as React from "react";

export type IReactPluginComponent<T> = React.FunctionComponent<{
  config: T;
  finishTrial: { (trialData: Object): void };
}>;


