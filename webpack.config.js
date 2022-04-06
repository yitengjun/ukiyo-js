const path = require('path');

module.exports = {
  mode: "production",

  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'ukiyo.min.js',
    library: 'Ukiyo',
    libraryExport: "default",
    libraryTarget: 'umd',
    environment: {
      arrowFunction: false
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
          ],
        }
      }]
    }]
  }
};
