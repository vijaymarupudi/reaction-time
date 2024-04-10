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

export function escapeHtml(html: string): string {
  const text = document.createTextNode(html);
  const p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

export function mutableShuffle<T>(array: Array<T>): void {
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (array.length))
    const one = array[i]
    const two = array[j]
    array[j] = one
    array[i] = two
  }
}

export function arrayCopy<T>(array: Array<T>): Array<T> {
  const newArray = new Array(array.length)
  for (let i = 0; i < newArray.length; i++) {
    newArray[i] = array[i]
  }
  return newArray
}

export function shuffle<T>(array: Array<T>): Array<T> {
  const newArray = arrayCopy(array)
  mutableShuffle(newArray)
  return newArray
}

export function getQueryParams(): Record<string, string>{
  const params = new URLSearchParams(window.location.search)
  const ret = {}
  for (const [key, value] of params.entries()) {
    ret[key] = value
  }
  return ret;
}
