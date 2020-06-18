const path = require("path");

const babelfilter = {
  test: /\.m?[tj]sx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "babel-loader"
  }
};

module.exports = [
  {
    mode: "development",
    entry: "./src/reaction-time-jspsych.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "reaction-time-jspsych.umd.js",
      library: "ReactionTime",
      libraryTarget: "umd"
    },
    module: {
      rules: [
        babelfilter,
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
  },
  {
    mode: "development",
    entry: "./src/reaction-time.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "reaction-time.umd.js",
      library: "ReactionTime",
      libraryTarget: "umd"
    },
    module: {
      rules: [
        babelfilter,
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
  }
  // ,
  // webpack cannot output esm yet
  // {
  //   mode: "development",
  //   entry: "./src/reaction-time.ts",
  //   output: {
  //     path: path.resolve(__dirname, "dist"),
  //     filename: "reaction-time.esm.js",
  //     library: "ReactionTime",
  //     libraryTarget: "umd"
  //   },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.tsx?$/,
  //         use: "ts-loader",
  //         exclude: /node_modules/
  //       },
  //       babelfilter
  //     ]
  //   },
  //   resolve: {
  //     extensions: [".tsx", ".ts", ".js"]
  //   }
  // }
];
