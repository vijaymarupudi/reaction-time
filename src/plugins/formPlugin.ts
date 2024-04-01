import { makePlugin } from "../make-plugin";

interface IFormPluginConfig {
  onInit?: (div: HTMLElement) => void;
  form: string
}

export const formPlugin = makePlugin<IFormPluginConfig>("formPlugin", (screen, config, callback) => {
  const form = document.createElement("form");
  screen.appendChild(form);
  const div = document.createElement("div");
  div.style.maxWidth = '1000px'
  div.style.margin = '0 auto';
  form.appendChild(div);
  div.innerHTML = config.form;
  if (config.onInit) {
    config.onInit(div)
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const ret = {};
    for (const [key, value] of formData.entries()) {
      ret[key] = value;
    }
    callback(ret);
  });
});
