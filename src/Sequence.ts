import { IPluginInstance, IPluginData } from "./types";
import { Stopwatch, IStopwatchOutput } from "./Stopwatch";

type IDataItem = IPluginData &
  IStopwatchOutput & { pluginIndex: number } & Record<string, unknown>;

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
      // maxWidth is necessary for horizontal scrollbars to not appear when the
      // viewport is longer than 100vh (scrollbars will take up space). This
      // caps 100vw to be the maximum width without scrollbars.
      // https://stackoverflow.com/questions/23367345/100vw-causing-horizontal-overflow-but-only-if-more-than-one
      this.root.style.maxWidth = '100%' 
      this.root.style.height = "100vh";
    }

    // clear the root element
    this.root.textContent = "";

    // Array that holds all the data
    this.data = [];

    const timelineIterable = timelineIterableFunc();
    // this is essentially a type cast. This is because structurally, an iterator can be used like an AsyncGenerator, it is a subset. Therefore this cast. If I learn of a way to make this typesafe, I will.
    const timeline = (getIterator(
      timelineIterable
    ) as unknown) as AsyncGenerator<IPluginInstance, void, IDataItem['output']>;
    // Used to send the user the output of a plugin
    let previousPluginOutput: IDataItem['output'];
    // To time the plugins
    const stopwatch = new Stopwatch();
    // To add to data
    let pluginIndex = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value: plugin, done } = await timeline.next(previousPluginOutput);
      // !plugin to appease the type checker
      if (done || !plugin) {
        break;
      }

      // clear the screen
      this.root.textContent = "";
      stopwatch.start();
      // Display the plugin
      const tmpPluginData = await plugin(this.root);
      const finalPluginData: IDataItem = {
        ...stopwatch.stop(),
        pluginIndex,
        ...tmpPluginData,
      };

      this.data.push(finalPluginData);

      // callback
      if (this.settings.onPluginFinish) {
        this.settings.onPluginFinish(finalPluginData);
      }

      // wrapping up for next iteration
      pluginIndex++;
      previousPluginOutput = finalPluginData.output;
    }

    // Sequence over, clean up target element
    this.root.removeAttribute("style");
    return this.data;
  }
}
