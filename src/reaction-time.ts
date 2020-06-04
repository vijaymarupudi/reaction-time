import ReactionTime from "./ReactionTime";
import { ITrial } from "./types";
import { jsPsychPlugin } from "./jspsych-plugin";
import { Stopwatch } from "./Stopwatch";

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

export { jsPsychPlugin };
