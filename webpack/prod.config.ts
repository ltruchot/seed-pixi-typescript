var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['./client/app.ts', './style.scss'],
  output: {
    filename: './public/scripts/bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    // Add '.ts' as a resolvable extension.
    extensions: ['.ts', '.js', '.css', '.scss']
  },
  module: {
    rules: [
     // all files with a '.ts'  extension will be handled by `ts-loader`
      {
        test: /\.ts$/, loader: 'ts-loader'
      },
      {
        test: /\.mp3$/, loader: 'file-loader'
      },
      { // sass / scss loader for webpack
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: '/public/styles/bundle.css',
      allChunks: true
    }),
  ],
};