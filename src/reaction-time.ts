import { ITrial, ITrialData } from "./types";
import { Stopwatch, IStopwatchOutput } from "./Stopwatch";

type ITrialFinalOutput = ITrialData & IStopwatchOutput & { trialIndex: number };

interface ITimelineGenerator {
  (data: Array<Object>): Iterator<ITrial, void, ITrialFinalOutput & any> | AsyncIterator<ITrial, void, ITrialFinalOutput & any>;
}

export function displayData(data: Object, screen: HTMLElement): void {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.innerText = JSON.stringify(data, null, 2);
  pre.appendChild(code);

  screen.innerHTML = "";
  screen.appendChild(pre);
}

export async function init(timelineGenerator: ITimelineGenerator) {

  // if body, take over the page
  const targetElement = document.body;
  if (targetElement === document.body) {
    targetElement.style.margin = "0px"
    targetElement.style.width = '100vw'
    targetElement.style.height = '100vh'
  }

  targetElement.innerHTML = '';

  // not using min-height because of https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height

  // screenContainer takes the dimensions of the targetElement
  const screenContainer = document.createElement('div')
  targetElement.appendChild(screenContainer);
  screenContainer.style.width = '100%'
  screenContainer.style.height = '100%'
  screenContainer.style.display = 'flex';

  
  const screen = document.createElement('div')
  // screen is centered within the screen container.
  // this method is for IE compat and for oversized elements to be scrollable
  // https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container
  screen.style.margin = 'auto'
  screenContainer.appendChild(screen)

  // Array that holds all the data
  const data = [];
  // The user provided timeline
  const timeline = timelineGenerator(data)
  // Used to send the user the output of a trial
  let previousTrialData: any;
  // To time the trials
  const stopwatch = new Stopwatch();
  // To add to data
  let trialIndex = 0;

  while (true) {
    const { value: trial, done } = await timeline.next(previousTrialData);
    // !trial to appease the type checker
    if (done || !trial) {
      break;
    }

    // clear the screen
    screen.innerHTML = ''
    stopwatch.start();
    // Display the trial
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
}

export { makePlugin } from './plugin-utils'
