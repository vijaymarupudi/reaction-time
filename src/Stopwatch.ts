function dateToISO8601(date: Date) {
  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function(num: number) {
      const norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
}


export interface IStopwatchOutput {
  pluginDuration: number,
  pluginStartDateTime: string,
  pluginStopDateTime: string,
  pluginStartTime: number,
  pluginStopTime: number
}

export class Stopwatch {
  private _startDateTime: Date;
  private _startTimeStamp: number;

  start(): void {
    this._startTimeStamp = performance.now();
    this._startDateTime = new Date(Date.now());
  }

  stop(): IStopwatchOutput {
    const now = performance.now()
    const pluginDuration = now - this._startTimeStamp;
    return {
      pluginDuration,
      pluginStartDateTime: dateToISO8601(this._startDateTime),
      pluginStopDateTime: dateToISO8601(new Date(Date.now())),
      pluginStartTime: this._startTimeStamp,
      pluginStopTime: now
    };
  }
}
