import * as React from "react";
import { makeReactPlugin } from './plugin-utils'
import { IReactPluginComponent } from './plugin-types'

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
//

interface IDelayPluginConfig {
  wait: number;
}

const Page: IReactPluginComponent<IDelayPluginConfig> = ({ config, finishTrial }) => {
  return (
    <p onClick={() => finishTrial({ state: "hello" })}>
      Hello world {JSON.stringify(config)}
    </p>
  );
}

export const delayPlugin = makeReactPlugin(Page);

// export const delayPlugin: IPlugin = (config: IDelayPluginConfig) => {
//   return function(screen: HTMLElement) {
//     return new Promise(resolve => {
//       ReactDOM.render(<Page config={config} finishTrial={resolve} />, screen);
//     });
//   };
//   // screen.innerHTML = `Hello World`;
//   // await wait(config.wait);
//   // screen.innerHTML = "";
//   // const button = document.createElement("button");
//   // button.innerText = "Finish";
//   // screen.appendChild(button);

//   // function buttonClickEvent() {
//   //   return new Promise(resolve => {
//   //     button.addEventListener("click", resolve);
//   //   });
//   // }

//   // await buttonClickEvent();
// };
