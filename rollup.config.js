// import { terser } from "rollup-plugin-terser";
// import { babel } from "@rollup/plugin-babel";
// import commonjs from "@rollup/plugin-commonjs";
// import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

function esmBasicBuild(inputFile, outDir) {
  return {
    input: inputFile,
    plugins:[ typescript(
      { declarationDir: 'dist/' + outDir }
    ) ],
    output: {
      dir: 'dist/' + outDir,
      format: 'es'
    }
  }
}

export default [
  esmBasicBuild('./src/reaction-time-jspsych.ts', 'reaction-time-jspsych'),
  esmBasicBuild('./src/reaction-time.ts', 'reaction-time')
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
