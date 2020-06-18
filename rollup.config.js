// import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
// import { babel } from "@rollup/plugin-babel";
// import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/reaction-time.ts",
  plugins: [typescript()],
  output: {
    file: "dist/reaction-time.esm.js",
    format: "esm",
    name: "ReactionTime"
  }
};
