import { IPlugin } from 'types'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface IDelayPluginConfig {
  wait: number;
}

export const delayPlugin: IPlugin = (config: IDelayPluginConfig) => {
  return async function(screen: HTMLElement) {
    screen.innerHTML = `Hello World`;
    await wait(config.wait);
    screen.innerHTML = "";
    const button = document.createElement("button");
    button.innerText = "Finish";
    screen.appendChild(button);

    function buttonClickEvent() {
      return new Promise(resolve => {
        button.addEventListener("click", resolve);
      });
    }

    await buttonClickEvent();

    return { status: "done" };
  };
};
