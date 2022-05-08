const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['src', 'node_modules'],
  },
  entry: {
    contentscript: ['contentscript'],
    backgroundscript: ['backgroundscript'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: 'none',
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
}
