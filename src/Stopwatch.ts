function dateToISO8601(date: Date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function(num: number) {
      var norm = Math.floor(Math.abs(num));
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
  trialDuration: number,
  trialStartDateTime: string,
  trialStopDateTime: string
}

export class Stopwatch {
  private _startDateTime: Date;
  private _startTimeStamp: number;

  start() {
    this._startTimeStamp = performance.now();
    this._startDateTime = new Date(Date.now());
  }

  stop(): IStopwatchOutput {
    const trialDuration = performance.now() - this._startTimeStamp;
    return {
      trialDuration,
      trialStartDateTime: dateToISO8601(this._startDateTime),
      trialStopDateTime: dateToISO8601(new Date(Date.now()))
    };
  }
}
