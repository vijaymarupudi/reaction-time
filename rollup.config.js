import typescript from "@rollup/plugin-typescript"

export default {
  input: "./src/reaction-time.ts",
  output: {
    format: "umd",
    name: "ReactionTime",
    file: './dist/reaction-time.js'
  },
  plugins: [
    typescript()
  ]
}
