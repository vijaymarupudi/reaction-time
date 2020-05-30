import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/reaction-time.ts",
    plugins: [typescript()],
    output: {
      file: "dist/reaction-time.development.js",
      format: "esm",
      name: "ReactionTime"
    }
  },
  {
    input: "src/reaction-time.ts",
    plugins: [
      typescript(),
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
      commonjs()
    ],
    output: {
      file: "dist/reaction-time.production.js",
      format: "umd",
      name: "ReactionTime",
      plugins: [terser({ compress: true, mangle: true })]
    }
  },
  {
    input: "src/test.ts",
    plugins: [typescript()],
    output: [
      {
        file: "dist/test.js",
        format: "iife"
      },
      {
        file: "dist/test.min.js",
        format: "iife",
        plugins: [terser({ compress: true, mangle: { toplevel: true } })]
      }
    ]
  }
];
