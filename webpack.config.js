var path = require('path')
module.exports = {
  entry: path.resolve(__dirname, 'src', 'app.ts'),
  output: {
    filename: './assets/scripts/bundle.js'
  },

  devtool: 'source-map',
  resolve: {
    // Add '.ts' as a resolvable extension.
    extensions: ['.ts', '.js']
  },

  module: {
    loaders: [
      // all files with a '.ts'  extension will be handled by `ts-loader`
      { test: /\.ts?$/, loader: 'ts-loader' }
    ]
  }
}
