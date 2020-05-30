const common = {
  target: "web",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};

module.exports = [
  {
    mode: "development",
    entry: "./src/reaction-time.ts",

    output: {
      library: "ReactionTime",
      libraryTarget: "umd",
      filename: "reaction-time.js"
    },
    ...common
  },
  {
    mode: "development",
    entry: {
      // "reaction-time": "./src/reaction-time.ts",
      test: "./src/test.ts"
      // "jspsych-plugin": "./src/jspsych-plugin.ts"
    },
    output: {
      filename: "[name].js"
    },
    ...common
  }
];
