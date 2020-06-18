import { ITrial, ITrialData } from "./types";
import { Stopwatch, IStopwatchOutput } from "./Stopwatch";

type ITrialFinalOutput = ITrialData & IStopwatchOutput;

interface ITimelineGenerator {
  (data: Array<Object>): Iterator<ITrial, void, ITrialFinalOutput & any>;
}

function displayData(data: Object, screen: HTMLElement): void {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.innerText = JSON.stringify(data, null, 2);
  pre.appendChild(code);

  screen.innerHTML = "";
  screen.appendChild(pre);
}

export async function init(timelineGenerator: ITimelineGenerator) {

  const targetElement = document.body;

  const screenContainer = document.createElement("div");
  if (targetElement === document.body) {
    document.body.style.margin = "0px"
    screenContainer.style.width = '100%'
    screenContainer.style.height = '100%'
  }
  targetElement.appendChild(screenContainer);

  const screen = document.createElement('div')
  screenContainer.appendChild(screen)

  const data = [];
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
    const finalTrialData: ITrialFinalOutput = {
      ...stopwatch.stop(),
      trialIndex,
      ...pluginTrialData
    };

    data.push(finalTrialData);

    // wrapping up for next iteration
    trialIndex++;
    previousTrialData = finalTrialData;
  }

  displayData(data, screen);
}
