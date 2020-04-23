const path = require('path');

const nodeModules = path.resolve(__dirname, 'node_modules');

const rules = [
  {
    exclude: nodeModules,
    test: /\.tsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        rootMode: 'upward'
      }
    }
  },
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: ['file-loader']
  }
];

module.exports = rules;
