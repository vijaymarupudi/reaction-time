import * as ReactDOM from "react-dom";
import * as React from "react";
import { IReactPluginComponent } from "./react-plugin-types";
import { makePlugin } from "./plugin-utils";

export function makeReactPlugin<T>(
  type: string,
  Component: IReactPluginComponent<T>
) {
  return makePlugin<T>(type, function(screen, config) {
    return new Promise(resolve => {
      return ReactDOM.render(
        <Component config={config} finishTrial={resolve} />,
        screen
      );
    });
  });
}
