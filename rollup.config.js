import typescript from "@rollup/plugin-typescript";

const common = {
  input: "./src/reaction-time.ts",
  plugins: [typescript()]
};

const buildProducts = [
  {
    ...common,
    // umd
    output: {
      format: "umd",
      name: "ReactionTime",
      file: "./dist/reaction-time.js"
    }
  },
  {
    ...common,
    // es
    output: {
      format: "es",
      file: "./dist/reaction-time.mjs"
    }
  }
];

buildProducts.push({
  input: "./src/test.ts",
  plugins: [typescript()],
  output: {
    file: "dist/test.js",
    format: "es"
  }
})

export default buildProducts
