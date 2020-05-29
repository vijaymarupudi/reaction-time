import { ITrial } from "./types";

function dateToISO8601(date: Date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function(num: number) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
}

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
