import { ITrial, ITrialData } from "./types";
import { dateToISO8601 } from './utils'

class Stopwatch {
  private _startDateTime: Date;
  private _startTimeStamp: number;

  start() {
    this._startTimeStamp = performance.now();
    this._startDateTime = new Date(Date.now());
  }

  stop() {
    const trialDuration = performance.now() - this._startTimeStamp;
    return {
      trialDuration,
      trialStartDateTime: dateToISO8601(this._startDateTime),
      trialStopDateTime: dateToISO8601(new Date(Date.now()))
    };
  }
}

type TimelineGenerator = { (reactionTime: ReactionTime): Iterable<ITrial> };

export class ReactionTime {
  private _data: Array<ITrialData>;
  constructor() {
    this._data = [];
  }

  push(item: ITrialData) {
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
    const stopwatch = new Stopwatch();
    let trialIndex = 0;
    while (true) {
      const { value: trial, done } = timeline.next(previousTrialData);
      stopwatch.start();
      const pluginTrialData = await trial(screen);
      const finalTrialData = {
        ...stopwatch.stop(),
        trialIndex,
        ...pluginTrialData
      };
      reactionTime.push(finalTrialData);
      trialIndex++;
      if (done) {
        break;
      }
      // wrapping up for next iteration
      previousTrialData = finalTrialData;
    }

    document.body.innerText = JSON.stringify(reactionTime.data());
  }
}
