import * as React from "react";
import { makeReactPlugin } from './react-plugin-utils'

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
//

interface IDelayPluginConfig {
  wait: number;
}

export const delayPlugin = makeReactPlugin<IDelayPluginConfig>("delayPlugin", ({ config, finishTrial }) => {
  return (
    <p onClick={() => finishTrial({ state: "hello" })}>
      Hello world {JSON.stringify(config)}
    </p>
  );
});


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
