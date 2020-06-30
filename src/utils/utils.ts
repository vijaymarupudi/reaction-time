import { Sequence } from "../Sequence";

/**
 * Takes in an experiment and displays the data on the screen
 * @param data The javascript object
 * @param screen The html element to display the data in.
 */
export function displayData(exp: Sequence): void {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.innerText = JSON.stringify(exp.data, null, 2);
  pre.appendChild(code);
  exp.element.innerHTML = "";
  exp.element.appendChild(pre);
}
