// import { terser } from "rollup-plugin-terser";
// import { babel } from "@rollup/plugin-babel";
// import commonjs from "@rollup/plugin-commonjs";
// import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "./src/reaction-time.ts",
    plugins: [
      typescript({
        tsconfig: false,
        module: "es6",
        target: "es2019"
      })
    ],
    output: {
      file: "./dist/bundles/reaction-time.es.js"
    }
  }
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
