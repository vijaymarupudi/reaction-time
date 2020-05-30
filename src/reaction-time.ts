import ReactionTime from './ReactionTime'
import { dateToISO8601 } from "./utils";
import { ITrial } from "./types";
import { jsPsychPlugin } from './jspsych-plugin'

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

export async function init(timelineGenerator: TimelineGenerator) {
  const screen = document.createElement("div");
  document.body.appendChild(screen);
  const reactionTime = new ReactionTime(screen);
  const timeline = timelineGenerator(reactionTime)[Symbol.iterator]();
  let previousTrialData: any;
  const stopwatch = new Stopwatch();
  let trialIndex = 0;
  while (true) {
    const { value: trial, done } = timeline.next(previousTrialData);
    if (done) {
      break;
    }
    stopwatch.start();
    const pluginTrialData = await trial(screen);
    const finalTrialData = {
      ...stopwatch.stop(),
      trialIndex,
      ...pluginTrialData
    };
    reactionTime.push(finalTrialData);
    trialIndex++;
    // wrapping up for next iteration
    previousTrialData = finalTrialData;
  }
}

export { jsPsychPlugin }
