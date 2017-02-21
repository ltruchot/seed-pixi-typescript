var path = require('path')
module.exports = {
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  devtool: 'source-map',

  resolve: {
    // Add '.ts' as a resolvable extension.
    extensions: ['.ts']
  },

  module: {
    loaders: [
      // all files with a '.ts'  extension will be handled by `ts-loader`
       { test: /\.ts?$/, loader: 'ts-loader' }
    ]
  }
}
