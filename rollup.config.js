import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

function std(jsPsych = false, es = true) {
  return {
    input: `./src/reaction-time${jsPsych ? "-jspsych" : ""}.ts`,
    plugins: [
      typescript({
        tsconfig: false,
        module: "es6",
        target: "es2019"
      })
    ],
    output: [
      {
        file: `./dist/bundles/reaction-time${jsPsych ? "-jspsych" : ""}.${es ? 'es' : 'umd'}.js`,
        plugins: [terser()],
        format: es ? 'es' : 'umd',
        ...es ? {} : {name: 'RT'}
      }
    ]
  };
}

function umd(jsPsych = false) {
  const base = std(jsPsych, false);
  base.plugins.push(
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
            useBuiltIns: "usage",
            corejs: 3
          }
        ]
      ],
      exclude: "node_modules/**/*",
      extensions: [".js", ".ts", ".tsx"]
    }),
    resolve(),
    commonjs()
  );
  return base
}

export default [
  std(),
  std(true),
  umd(),
  umd(true)
  // {
  //   input: "./src/reaction-time.ts",
  //   plugins: [
  //     typescript({
  //       jsx: 'react'
  //     }),
  //     babel({
  //       babelHelpers: "bundled",
  //       presets: [
  //         [
  //           "@babel/preset-env",
  //           {
  //             targets: "> 0.25%, not dead",
  //             useBuiltIns: "usage",
  //             corejs: 3
  //           }
  //         ]
  //       ],
  //       exclude: "node_modules/**/*",
  //       extensions: [".js", ".ts", ".tsx"]
  //     }),
  //     resolve(),
  //     commonjs()
  //   ],
  //   output: {
  //     file: "dist/reaction-time.umd.js",
  //     format: "umd",
  //     name: "ReactionTime",
  //     plugins: [terser()]
  //   }
  // },
  // {
  // input: "./src/reaction-time-jspsych.ts",
  // plugins: [
  //   typescript({
  //     jsx: 'react'
  //   }),
  //   babel({
  //     babelHelpers: "bundled",
  //     presets: [
  //       [
  //         "@babel/preset-env",
  //         {
  //           targets: "> 0.25%, not dead",
  //           useBuiltIns: "usage",
  //           corejs: 3
  //         }
  //       ]
  //     ],
  //     exclude: "node_modules/**/*",
  //     extensions: [".js", ".ts", ".tsx"]
  //   }),
  //   resolve(),
  //   commonjs()
  // ],
  // output: {
  //   file: "dist/reaction-time-jspsych.umd.js",
  //   format: "umd",
  //   name: "ReactionTime",
  //   plugins: [terser()]
  // }
  // },
];
