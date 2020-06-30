# reaction-time

A javascript / typescript library for online psychology experiments.

## What is a timeline generator?

A timeline generator is an async or normal iterator that yields plugins.

## What is a plugin?

```typescript
function plugin(screen: HTMLElement);
```

More specifically, a plugin is a closure function that contains the
configuration for the experiment. The core of reaction-time has no idea of
what the configuration provided to the plugin was.

It is responsibility of the plugin to include the configuration in the final
data object it returns, along with identifying information about which plugin
was run.

## Usage

```javascript
import * as RT from '@vijaymarupudi/reaction-time' // if using a bundler

const exp = new RT.Experiment()

exp.init(function*() {
  yield RT.plugins.jsPsych({
    type: 'html-button-response',
    // ...
  })
})
```

## Builds

* `reaction-time-core` comes with `Sequence` and `makePlugin`, the bare minimum you need for a DIY experiment.
* In addition, `reaction-time` comes with plugins and tachyons for css.
* In addition, `reaction-time-jspsych` comes with jsPsych (including it's css).
