import typescript from "@rollup/plugin-typescript";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

// import path from "path";

// plugins: [
//   terser(),
//   getBabelOutputPlugin({
//     presets: [
//       [
//         "@babel/preset-env",
//         {
//           useBuiltIns: "usage",
//           corejs: 3,
//           targets: "> 0.25%, not dead",
//           modules: "umd"
//         }
//       ]
//     ]
//   })
// ]
const buildProducts = {
  input: "./src/reaction-time.ts",
  plugins: [typescript()],
  output: [
    {
      format: "esm",
      name: "ReactionTime",
      file: "./dist/reaction-time.js",
      plugins: [terser()]
    },
    {
      format: "esm",
      file: "./dist/reaction-time.mjs"
    }
  ]
};

// buildProducts.push({
//   input: "./src/test.ts",
//   plugins: [typescript()],
//   output: {
//     file: "dist/test.js",
//     format: "es"
//   }
// });

export default buildProducts;
