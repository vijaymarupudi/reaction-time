import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import process from "process";
import postcss from 'rollup-plugin-postcss'

function generate({ jsPsych = false, es = true, libraryDevelopment = false, core = false }) {
  
  if (core && jsPsych) {
    throw "core and jsPsych cannot be on at the same time"
  }

  return {
    input: `./src/reaction-time${jsPsych ? "-jspsych" : ""}${core ? '-core' : ''}.ts`,
    plugins: [
      typescript({
        tsconfig: false,
        module: "es6",
        target: "es2019",
        esModuleInterop: true
      }),
      resolve(), // for third party dependencies (like mithril)
      commonjs(),
      postcss(),
      ...(!es && !libraryDevelopment
        ? [
            babel({
              babelHelpers: "bundled",
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "> 0.25%, not dead",
                    useBuiltIns: "usage",
                    corejs: 3,
                  },
                ],
              ],
              exclude: "node_modules/**/*",
              extensions: [".js", ".ts", ".tsx"],
            }),
            resolve(),
            commonjs(),
          ]
        : []),
    ],
    output: [
      {
        file: `./dist/bundles/reaction-time${jsPsych ? "-jspsych" : ""}${core ? '-core' : ''}.${
          es ? "es" : "umd"
        }.js`,
        plugins: libraryDevelopment ? [] : [terser()],
        format: es ? "es" : "umd",
        ...(es ? {} : { name: "RT" }),
      },
    ],
  };
}

const DEV_MODE = process.env.NODE_ENV == "development";

export default [
  generate({ jsPsych: true, es: true, libraryDevelopment: DEV_MODE }),
  generate({ jsPsych: false, es: true, libraryDevelopment: DEV_MODE }),
  generate({ jsPsych: true, es: false, libraryDevelopment: DEV_MODE }),
  generate({ jsPsych: false, es: false, libraryDevelopment: DEV_MODE }),
  generate({ jsPsych: false, es: true, libraryDevelopment: DEV_MODE, core: true }),
];
