module.exports = {
  mode: "development",
  entry: {
    "reaction-time": "./src/reaction-time.ts",
    test: "./src/test.ts"
  },
  output: {
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
