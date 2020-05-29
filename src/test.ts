import { delayPlugin } from "./delay-plugin";
import { ReactionTime } from "./reaction-time";

function* timelineGenerator(reactionTime: ReactionTime) {
  while (true) {
    const result = yield delayPlugin({
      wait: 1000
    });
    console.log(result);
  }
}

ReactionTime.init(timelineGenerator);
