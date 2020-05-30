Hello people interested in jsPsych,

For the past month I've been helping out people with their jsPsych problems,
and have noticed several patterns in the errors that happen. People sometimes
want to do something complicated involving a dynamic number of trials. People
want to evaluate certain parameters at the time of the experiment rather than
before it begins.

I believe a lot of this stems from a lack of understanding of the asynchronous
nature of Javascript and the complexity of lifecycle callbacks. When jsPsych
was first made, back in 2012, I believe there was no other way to deal with
these problems. However the Javascript language and ecosystem have evolved in
that time, and I'd like to incorporate those ideas to make designing online
experiments easier.

I decided to write a library to do so. I was heavily inspired by jsPsych's
elegance, and will continue to draw on it for code and ideas. It is very much
in progress, but is currently functional. My primary goal was to eliminate the
common questions by designing a different API. This required a department from
the declarative nature of jsPsych towards a more runtime specified design. The
Javascript feature I have focused on using are [generator functions]. They
allow executation of code to be paused and played at specific points of the
function.

[generator functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

Generator functions allow for a more intuitive flow of code that I think is
easier for a beginner, a common user of jsPsych, to understand. Here is an
example of a simple experiment that requires participants to click a button
within 500ms of it being displayed. If they do not succeed, they would have to
try again. In jsPsych, this would require a loop_function and an on_finish
callback, however here it is in the library I have made.

Make sure you have jsPsych's js, css, and the appropriate plugin js loaded.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="jsPsych/jspsych.js"></script>
    <script src="jsPsych/plugins/jspsych-html-button-response.js"></script>
    <script src="dist/reaction-time.js"></script>
    <link rel="stylesheet" href="jsPsych/css/jspsych.css" />
  </head>
  <body>
    <script>
      function* timelineGenerator(reactionTime) {

        while (true) {
          const result = yield ReactionTime.jsPsychPlugin({
            type: "html-button-response",
            stimulus: "<p>Click fast</p>",
            choices: ["Here"]
          });

          console.log(result); // data for that specific trial
          console.log(Date.now()); // timestamp for the moment the trial is over

          if (result.rt < 500) {
            break;
          }

          yield ReactionTime.jsPsychPlugin({
            type: "html-button-response",
            stimulus: "<p>Too slow! Your RT was " + result.rt.toString() + "</p>",
            choices: ["Try again"]
          })
        }

        reactionTime.displayData();

      }

      ReactionTime.init(timelineGenerator);
    </script>
  </body>
</html>
```

I have attached a fully working sample with the library code in this zip file. Click `index.html` to enjoy! If you'd like to explore the library code, check out the `src/ReactionTime.ts`, `src/reaction-time.ts`, and the `src/jspsych-plugin.ts` files.

Source code is also available at <https://github.com/vijaymarupudi/reaction-time>

I have named the library `ReactionTime` for now, hopefully that is not
too confusing. `reactionTime` is an interface to the library. I'd like opinions
on what people think of this API. Also you may have noticed that I was using a
jsPsych plugin! While the plugin system is a little different for my library,
they can are compatible with each other.

The code for this API is surprisingly simple and short. I have wrapper almost
all jsPsych plugins (and most of jsPsych) within 100 lines of code. The library
is written in Typescript for easier long term maintenance and useful editor
hints in editors like Atom, VSCode, and Vim. I make liberal use of modern
Javascript features (Promises & Async functions) knowing that I can transpile
them to work in old browsers. Features like `Proxy` that aren't possible in
older browsers have been avoided.

A few notes on design philosophy. I have a design goal to keep this library
simple and easy to maintain. I personally think that tasks that can be
trivially performed in a loop should be done using loops. That would mean no
timeline variables and no looping or conditional functions. I do realize that
the declarative API that jsPsych provides makes it very easy to design simple
experiments, I think the lack of an "escape hatch" makes it difficult to use
for complicated ones that I have seen in the wild.

I think this api would make the follow features mentioned in the documentation redundant because generator functions make asynchronous code appear synchronous:

* Functions for stimulus values (dynamic parameters).
* Repeating trials
* Looping timelines
* Conditional timelines
* data parameter
* Trial lifecycle callbacks

One con of this approach is that autopreloading is impossible. I think that's an acceptable tradeoff and that is it okay to ask the user to call the preload function with their list of media.

Aesthetically, I have completely avoided globals (such as depending on a single
display_element being defined for the whole page) for the plugin API. I also
plan on defering a lot of the work that's in `jspsych.js` to the plugins
(specifically multimedia associated code). Given the modular design of the
code, this would make it easier to maintain different plugins of the same media
type.

Wrapping jsPsych was an important goal for this library, as the work
determining the nuances and quirks of browsers and multimedia playback is all
stored in the code and I would not want to rewrite all of it. I hope for new
plugins to be written using the `React` library with reusable hooks to maintain
side-effects and state, but whether that will happen will depend on intersect.

For future directions, I'd like to see if there's any interest at all. I plan
on using this as a personal library to design some of the more complicated
experiments, but if there's interest there are many options. One option would
be to make this API the 'escape-hatch' in jsPsych ala
`jsPsych.init_generator()`. Another not mutually exclusive option would be to
publish it and maintain it alongside jsPsych.

I think a lot of the value in jsPsych and probably the time spent on it was the
documentation and tutorials. So if there's interest, I might spend some time on
this API. Let me know your thoughts!

License: LGPL-3.0 or later

\~ Vijay
