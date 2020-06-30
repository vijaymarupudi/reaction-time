import { IPluginInstance, IPluginData } from "./types";
import { Stopwatch, IStopwatchOutput } from "./Stopwatch";
export { makePlugin } from "./make-plugin";

type ITrialFinalOutput = IPluginData &
  IStopwatchOutput & { trialIndex: number } & Record<string, unknown>;

type ITimelineIterable = Iterable<IPluginInstance>;

/**
 * Takes in a javascript object and displays them on the screen.
 * @param data The javascript object
 * @param screen The html element to display the data in.
 */
export function displayData(
  data: Record<string, unknown>,
  screen: HTMLElement
): void {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.innerText = JSON.stringify(data, null, 2);
  pre.appendChild(code);

  screen.innerHTML = "";
  screen.appendChild(pre);
}

/**
 * Convertes an iterable in either an async or sync iterator
 */
function getIterator<YieldType, SendType>(
  iterable: Iterable<YieldType>
): Iterator<YieldType, void, SendType> {
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]();
  } else {
    return iterable[Symbol.iterator]();
  }
}

export class Experiment {
  private element: HTMLElement;
  constructor(element?: HTMLElement) {
    this.element = element ?? document.body;
  }

  /**
   * The core of reaction-time. Takes in an iterable that yields plugin
   * instances, which are then run with the screen. Collects data from the
   * instances.
   *
   * @param timelineIterable An iterable that yields plugin instances. This
   * can be a generator function (recommended) or an array.
   * @returns A promise holding the data for the experiment.
   */
  async init(
    timelineIterable: ITimelineIterable
  ): Promise<Array<ITrialFinalOutput>> {
    // if body, take over the page
    if (this.element === document.body) {
      this.element.style.margin = "0px";
      this.element.style.width = "100vw";
      this.element.style.height = "100vh";
    }

    this.element.innerHTML = "";

    // not using min-height because of https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height

    // screenContainer takes the dimensions of the this.element
    const screenContainer = document.createElement("div");
    this.element.appendChild(screenContainer);
    screenContainer.style.width = "100%";
    screenContainer.style.height = "100%";
    screenContainer.style.display = "flex";

    const screen = document.createElement("div");
    // screen is centered within the screen container.
    // this method is for IE compat and for oversized elements to be scrollable
    // https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container
    screen.style.margin = "auto";
    screenContainer.appendChild(screen);

    // Array that holds all the data
    const data = [];
    // this is essentially a type cast. This is because structurally, an iterator can be used like an AsyncGenerator, it is a subset. Therefore this cast. If I learn of a way to make this typesafe, I will.
    const timeline = (getIterator(
      timelineIterable
    ) as unknown) as AsyncGenerator<IPluginInstance, void, ITrialFinalOutput>;
    // Used to send the user the output of a trial
    let previousTrialData: ITrialFinalOutput;
    // To time the trials
    const stopwatch = new Stopwatch();
    // To add to data
    let trialIndex = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value: trial, done } = await timeline.next(previousTrialData);
      // !trial to appease the type checker
      if (done || !trial) {
        break;
      }

      // clear the screen
      screen.innerHTML = "";
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

    // Experiment over, clean up target element
    this.element.removeAttribute("style");
    return data;
  }
}

