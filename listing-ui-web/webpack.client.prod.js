const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const OptimizeJsPlugin = require('optimize-js-plugin');
const ReactLoadablePlugin = require('react-loadable/webpack')
  .ReactLoadablePlugin;
const rules = require('./webpack.rules');

const dist = path.resolve(__dirname, 'dist', 'client');

module.exports = {
  devtool: 'source-map',
  target: 'web',
  mode: 'production',
  entry: {
    app: ['./src/client/index.tsx']
  },
  module: { rules },
  optimization: {
    namedChunks: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        shared: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  node: {
    fs: 'empty'
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: dist,
    publicPath: '/listing-ui-web/static/'
  },
  plugins: [
    new ReactLoadablePlugin({
      filename: './dist/react-loadable.json'
    }),
    new OptimizeJsPlugin({
      sourceMap: true
    }),
    new webpack.EnvironmentPlugin({
      BUILD_TYPE: 'client'
    }),
    new Dotenv({
      path: './.env.prod',
      systemvars: true
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: path.resolve('../../../../node_modules/react'),
      shared: path.resolve('../../../../node_modules/shared')
    }
  }
};
