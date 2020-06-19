# reaction-time-js

A javascript / typescript library for online psychology experiments.

## What is a timeline generator?

A timeline generator is an async or normal iterator that yields plugins.

## What is a plugin?

```typescript
function plugin(screen: HTMLElement);
```

More specifically, a plugin is a closure function that contains the
configuration for the experiment. The core of reaction-time-js has no idea of
what the configuration provided to the plugin was.

It is responsibility of the plugin to include the configuration in the final
data object it returns, along with identifying information about which plugin
was run.

## Usage


```javascript
import * as ReactionTime from 'reaction-time-js'
const ReactionTime = require('reaction-time-js/dist/reaction-time.umd')
const ReactionTime = require('reaction-time-js/dist/reaction-time-jspsych.umd')
```
