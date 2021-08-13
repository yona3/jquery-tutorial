const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
