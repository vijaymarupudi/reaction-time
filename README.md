# reaction-time

A javascript / typescript library for online psychology experiments.

## What is a timeline generator?

A timeline generator is an async or normal iterator that yields plugins.

## What is a plugin?

A plugin is a function that takes in a configuration and return an
action function.

An action function is a function that takes a screen (a HTMLElement)
and returns a Promise that resolves to the data outputted by the plugin.

It is responsibility of the plugin to include the configuration in the final
data object it returns, along with identifying information about which plugin
was run.

Use `RT.make_plugin()` to make life easier. Here is the type signature.

```typescript
function makePlugin<T>(
  type: string,
  inputParam: (
    screen: HTMLElement,
    config: T,
    callback: (data: IPluginData["output"]) => void
  ) => void
);
```

It'll take care of saving the input and the plugin type. All you need
to do it use screen and config, and use `callback(data)` to send the
data and end the trial.

## Usage

```javascript
import * as RT from '@vijaymarupudi/reaction-time'

const exp = new RT.Sequence()

exp.init(function*() {
  yield plugin({
    duration: 1000,
    // ...
  })
})
```

## Usage with jsPsych

```javascript
import * as RT from '@vijaymarupudi/reaction-time'
import { initJsPsych } from 'jspsych'
import keyResponse from '@jspsych/plugin-html-keyboard-response'

const seq = new RT.Sequence()

RT.plugins.jsPsych.init(initJsPsych())

seq.init(function* () {
  yield RT.plugins.jsPsych({
    type: keyResponse,
    stimulus: "Hello World!",
    choices: ['f', 'j']
  });

  yield RT.plugins.jsPsych({
    type: keyResponse,
    stimulus: "Hello wow!",
    choices: ['f', 'j']
  });

}).then(() => RT.utils.displayData(seq))
```
