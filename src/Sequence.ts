import { IPluginInstance, IPluginData } from "./types";
import { Stopwatch, IStopwatchOutput } from "./Stopwatch";

type IDataItem = IPluginData &
  IStopwatchOutput & { trialIndex: number } & Record<string, unknown>;

type ITimelineIterableFunc = () => Iterable<IPluginInstance>;

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

interface ISequenceSettings {
  root: HTMLElement;
  onPluginFinish?: (item: IDataItem) => void;
}

const SEQUENCE_SETTINGS_DEFAULT: ISequenceSettings = {
  root: document.body,
};

export class Sequence {
  public root: HTMLElement;
  public data: Array<IDataItem>;
  public settings: ISequenceSettings;
  constructor(settings?: Partial<ISequenceSettings>) {
    const finalSettings = { ...SEQUENCE_SETTINGS_DEFAULT };
    Object.assign(finalSettings, settings);
    this.settings = finalSettings;
    this.root = finalSettings.root;
  }

  /**
   * The core of reaction-time. Takes in an iterable that yields plugin
   * instances, which are then run with the screen. Collects data from the
   * instances.
   *
   * @param timelineIterableFunc A function that returns an iterable. This can
   * be a generator function (recommended) or a function that returns an array.
   * @returns A promise holding the data for the experiment.
   */
  async init(
    timelineIterableFunc: ITimelineIterableFunc
  ): Promise<Array<IDataItem>> {
    // if body, take over the page
    if (this.root === document.body) {
      this.root.style.margin = "0px";
      this.root.style.width = "100vw";
      this.root.style.height = "100vh";
    }

    this.root.innerHTML = "";

    // not using min-height because of https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height

    // screenContainer takes the dimensions of the this.root
    const screenContainer = document.createElement("div");
    this.root.appendChild(screenContainer);
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
    this.data = [];

    const timelineIterable = timelineIterableFunc();
    // this is essentially a type cast. This is because structurally, an iterator can be used like an AsyncGenerator, it is a subset. Therefore this cast. If I learn of a way to make this typesafe, I will.
    const timeline = (getIterator(
      timelineIterable
    ) as unknown) as AsyncGenerator<IPluginInstance, void, IDataItem['output']>;
    // Used to send the user the output of a trial
    let previousTrialOutput: IDataItem['output'];
    // To time the trials
    const stopwatch = new Stopwatch();
    // To add to data
    let trialIndex = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value: trial, done } = await timeline.next(previousTrialOutput);
      // !trial to appease the type checker
      if (done || !trial) {
        break;
      }

      // clear the screen
      screen.innerHTML = "";
      stopwatch.start();
      // Display the trial
      const pluginTrialData = await trial(screen);
      const finalTrialData: IDataItem = {
        ...stopwatch.stop(),
        trialIndex,
        ...pluginTrialData,
      };

      this.data.push(finalTrialData);

      // callback
      if (this.settings.onPluginFinish) {
        this.settings.onPluginFinish(finalTrialData);
      }

      // wrapping up for next iteration
      trialIndex++;
      previousTrialOutput = finalTrialData.output;
    }

    // Sequence over, clean up target element
    this.root.removeAttribute("style");
    return this.data;
  }
}
