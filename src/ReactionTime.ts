import { ITrialData } from "./types";

export default class ReactionTime {
  private _data: Array<ITrialData>;
  constructor(private screen: HTMLElement) {
    this._data = [];
  }

  push(item: ITrialData) {
    this._data.push(item);
  }

  data() {
    return this._data;
  }

  displayData() {
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.innerText = JSON.stringify(this.data(), null, 2);
    pre.appendChild(code)

    this.screen.innerHTML = ''
    this.screen.appendChild(pre)
  }
}
