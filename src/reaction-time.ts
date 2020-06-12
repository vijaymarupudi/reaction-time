import ReactionTime from "./ReactionTime";
import { ITrial } from "./types";
import { jsPsychPlugin } from "./jspsych-plugin";
import { Stopwatch } from "./Stopwatch";

type TimelineGenerator = { (reactionTime: ReactionTime): Iterable<ITrial> };

function displayData(data: Object, screen: HTMLElement): void {
  const pre = document.createElement('pre')
  const code = document.createElement('code')
  code.innerText = JSON.stringify(data, null, 2);
  pre.appendChild(code)

  screen.innerHTML = ''
  screen.appendChild(pre)
}

export async function init(timelineGenerator: TimelineGenerator) {
  const screen = document.createElement("div");
  document.body.appendChild(screen);
  const data = []
  const timeline = timelineGenerator(data)[Symbol.iterator]();
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
    data.push(finalTrialData);
    trialIndex++;
    // wrapping up for next iteration
    previousTrialData = finalTrialData;
  }

  displayData(data, screen);
}

export { jsPsychPlugin };
