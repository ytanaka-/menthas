const package = require("./package.json");
const version = package.version;
const path = require("path");

module.exports = {
  mode: "development",

  entry: path.join(__dirname, "src/frontend/app.js"),

  output: {
    filename: "bundle.js",
    path: path.join(__dirname, `public/assets/${version}`),
    assetModuleFilename: "images/[hash][ext][query]",
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts"],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg/,
        type: "asset/resource",
      },
    ],
  },
};
