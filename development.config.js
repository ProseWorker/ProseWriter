/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); // 用于访问内置插件

module.exports = {
  cache: true,
  mode: "development",
  devtool: "inline-source-map", // "inline-source-map" "eval-cheap-module-source-map"
  entry: [
    "./app/index",
  ],
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      { test: /\.txt$/, use: "raw-loader" },
      {
        test: /\.[jt]sx?$/,
        loader: "babel-loader",
        exclude: [
          path.join(__dirname, "node_modules")
        ],
        include: [
          path.join(__dirname, "app"),
          path.join(__dirname, "shared"),
        ],
        options: {
          cacheDirectory: true
        }
      },
      { test: /\.(png|jpg|svg)$/, loader: 'url-loader' },
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader" ]
      },
    ],
  },
  devServer: {
    static: "./dist",
    hot: true,
    compress: true,
    port: 8008,
    open: true,
    allowedHosts: [
      "localhost",
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: [
      path.resolve(__dirname, "app"),
      "node_modules"
    ],
    alias: {
      "~": path.resolve(__dirname, "app"),
      "@shared": path.resolve(__dirname, 'shared')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      scriptLoading: "blocking"
    })
  ]
};
