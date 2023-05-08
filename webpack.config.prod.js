const path = require("path");

module.exports = {
  mode: "production",

  entry: "./src/main.ts",

  output: {
    clean: true,
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },
};
