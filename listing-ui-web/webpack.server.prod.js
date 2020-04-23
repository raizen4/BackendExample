const path = require('path');
const Dotenv = require('dotenv-webpack');
const OptimizeJsPlugin = require('optimize-js-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rules = require('./webpack.rules');

const dist = path.resolve(__dirname, 'dist', 'server');
const distClient = path.resolve(__dirname, 'dist', 'client');
const staticFiles = path.resolve(__dirname, 'static');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [
    nodeExternals({
      modulesFromFile: {
        exclude: [{ express: { commonjs: 'express' } }]
      }
    })
  ],
  entry: {
    app: ['./src/server/index.tsx']
  },
  module: { rules },
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    filename: '[name].js',
    path: dist,
    publicPath: '/'
  },
  plugins: [
    new CopyWebpackPlugin([{ from: `${staticFiles}`, to: `${distClient}` }]),
    new OptimizeJsPlugin({
      sourceMap: true
    }),
    new Dotenv({
      path: './.env.prod',
      systemvars: true
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: path.resolve('../../../../node_modules/react')
    }
  }
};
