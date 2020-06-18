import { init } from "./reaction-time";
import { jsPsychPlugin } from "./jspsych-plugin";

init(function*() {
  while (true) {
    const result = yield jsPsychPlugin({
      type: "html-button-response",
      stimulus: "<p>Click fast</p>",
      choices: ["Here"]
    });

    console.log(result); // data for that specific trial
    console.log(performance.now());
    if (result.output.rt < 100) {
      break;
    }
  }
});
