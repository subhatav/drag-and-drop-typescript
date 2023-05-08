const path = require("path");

module.exports = {
  mode: "development",

  entry: "./src/main.ts",

  output: {
    clean: true,
    publicPath: "/dist",
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

  devtool: "inline-source-map",

  devServer: {
    port: 3000,

    hot: true,
    open: false,
    compress: true,

    client: {
      progress: true,
    },

    static: {
      directory: path.join(__dirname, "/"),
    },
  },
};
