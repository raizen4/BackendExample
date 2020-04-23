const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const rules = require('./webpack.rules');

const port = parseInt(process.env.NODE_PORT) || 3000;
const dist = path.resolve(__dirname, 'dist');
const distServer = path.resolve(dist, 'server');

module.exports = {
  devServer: {
    contentBase: distServer,
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    port,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 5000
    },
    noInfo: true,
    stats: 'minimal'
  },
  devtool: 'source-map',
  entry: {
    app: ['./src/client/index.tsx']
  },
  module: {
    rules: rules
  },
  node: {
    fs: 'empty'
  },
  output: {
    filename: '[name].js',
    path: dist,
    publicPath: '/'
  },
  plugins: [
    new WebpackBar(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'LaunchB',
      template: 'index.html'
    }),
    new webpack.EnvironmentPlugin({
      BUILD_TYPE: 'client'
    }),
    new Dotenv({
      path: './.env',
      systemvars: true
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: path.resolve('../../../../node_modules/react')
    }
  },
  target: 'web',
  mode: 'development'
};
