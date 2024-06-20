import { IPluginInstance, IPluginData } from "./types";
import { Stopwatch, IStopwatchOutput } from "./Stopwatch";
import { dataPlugin } from './plugins/dataPlugin'

type IDataItem = IPluginData &
  IStopwatchOutput & { pluginIndex: number } & Record<string, unknown>;

type ITimelineIterableFunc = () => Iterable<IPluginInstance>;

/**
 * Converts an iterable in either an async or sync iterator
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
      // maxWidth is necessary for horizontal scrollbars to not appear when the
      // viewport is longer than 100vh (scrollbars will take up space). This
      // caps 100vw to be the maximum width without scrollbars.
      // https://stackoverflow.com/questions/23367345/100vw-causing-horizontal-overflow-but-only-if-more-than-one
      this.root.style.width = "100vw";
      this.root.style.maxWidth = '100%'
      this.root.style.height = '100vh';
      // This is being done to prevent scrollbars from appearing when the first element of the root element has a margin. This is due to margin collapsing
      //
      // See https://stackoverflow.com/questions/19718634/how-to-disable-margin-collapsing
      this.root.style.display = 'flex';
      this.root.style.flexDirection = 'column';
      // This would make even inline items appear like block items. That is why
      // there will be a child div that will serve as the screen.
    }

    // clear the root element
    this.root.textContent = "";

    const screen = document.createElement('div')
    this.root.appendChild(screen)
    screen.style.flex = '1';

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

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value: plugin, done } = await timeline.next(previousPluginOutput);
      // !plugin to appease the type checker
      if (done || !plugin) {
        break;
      }

      // clear the screen
      screen.textContent = "";
      stopwatch.start();
      // Display the plugin
      const tmpPluginData = await plugin(screen);
      const pluginIndex = this.data.length == 0 ? 0 : this.data[this.data.length - 1].pluginIndex + 1
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
      previousPluginOutput = finalPluginData.output;
    }

    // Sequence over, clean up target element
    this.root.removeAttribute("style");
    return this.data;
  }

  async pushData(item: any) {
    const stop = new Stopwatch()
    stop.start()
    const pluginIndex = this.data.length == 0 ? 0 : this.data[this.data.length - 1].pluginIndex + 1
    const data = await (dataPlugin({ data: item }))(null)
    this.data.push({...stop.stop(), pluginIndex, ...data})
  }
}
