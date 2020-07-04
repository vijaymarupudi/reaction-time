import cxs from "cxs";
import m from "./m";
import afterframe from "afterframe";

export class Stopwatch {
  private startDT: number = null;
  private startTS: number = null;
  start(): void {
    afterframe(() => {
      this.startDT = new Date().valueOf();
      this.startTS = performance.now();
    });
  }

  stop(): { startDateTime: number; stopDateTime: number; duration: number } {
    return {
      startDateTime: this.startDT,
      stopDateTime: new Date().valueOf(),
      duration: performance.now() - this.startTS,
    };
  }
}

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export { cxs, m };
