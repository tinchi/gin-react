const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './js'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, './assets/js'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
};