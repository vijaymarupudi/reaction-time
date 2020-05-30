import * as ReactDOM from "react-dom";
import * as React from "react";
import { IReactPluginComponent } from "./plugin-types";
import { IPlugin } from "./types";

export function makeReactPlugin<T>(
  Component: IReactPluginComponent<T>
): IPlugin {
  return function(config: T) {
    return function(screen: HTMLElement) {
      return new Promise(resolve => {
        ReactDOM.render(
          <Component config={config} finishTrial={resolve} />,
          screen
        );
      });
    };
  };
}
