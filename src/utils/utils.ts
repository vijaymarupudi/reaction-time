import { Sequence } from "../Sequence";

/**
 * Takes in a sequence and displays the data on the screen
 * @param data The javascript object
 * @param screen The html element to display the data in.
 */
export function displayData(exp: Sequence): void {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.innerText = JSON.stringify(exp.data, null, 2);
  pre.appendChild(code);
  exp.root.innerHTML = "";
  exp.root.appendChild(pre);
}
