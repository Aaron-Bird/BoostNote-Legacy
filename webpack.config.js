const skeleton = require('./webpack-skeleton')
const path = require('path')

var config = Object.assign({}, skeleton, {
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel?cacheDirectory'
      },
      {
        test: /\.styl?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!stylus?sourceMap'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'compiled'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    libraryTarget: 'commonjs2',
    publicPath: 'http://localhost:8080/assets/'
  },
  debug: true,
  devtool: 'eval-source-map'
})

module.exports = config

