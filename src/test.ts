import ReactionTime from "./ReactionTime";
import { init, jsPsychPlugin } from "./reaction-time"

function* timelineGenerator(reactionTime: ReactionTime) {
  while (true) {
    const result = yield jsPsychPlugin({
      type: "html-button-response",
      stimulus: "<p>Click fast</p>",
      choices: ["Here"]
    });

    console.log(result); // data for that specific trial
    console.log(Date.now()); // timestamp for the moment the trial is over

    if (result.rt < 500) {
      break;
    }
  }
  reactionTime.displayData();
}

init(timelineGenerator);
