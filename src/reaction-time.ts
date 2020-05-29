import { ITrial, IPlugin } from './types'
import { delayPlugin } from './delay-plugin'

function isIterable(obj: any): boolean {
  return typeof obj[Symbol.iterator] === "function";
}

class Stopwatch {
  private _start: number;

  start() {
    this._start = performance.now()
  }

  stop() {
    return performance.now() - this._start;
  }

}

type TimelineGenerator = { (reactionTime: ReactionTime): Iterable<ITrial> };

class ReactionTime {
  private _data: Array<Object>;
  constructor() {
    this._data = [];
  }

  push(item: Object) {
    this._data.push(item);
  }

  data() {
    return this._data;
  }

  static async init(timelineGenerator: TimelineGenerator) {
    const reactionTime = new ReactionTime();
    const screen = document.createElement("div");
    document.body.appendChild(screen);
    const timeline = timelineGenerator(reactionTime)[Symbol.iterator]();
    let previousTrialData: any;
    while (true) {
      const { value: trial, done } = timeline.next(previousTrialData);
      const trialData = await trial(screen);
      reactionTime.push(trialData);
      if (done) {
        break;
      }
      // wrapping up for next iteration
      previousTrialData = trialData;
    }

    document.body.innerText = JSON.stringify(reactionTime.data());
  }
}

function* timelineGenerator(reactionTime: ReactionTime) {
  while (true) {
    const result = yield delayPlugin({
      wait: 1000
    });
    console.log(result);
  }
}

ReactionTime.init(timelineGenerator);
