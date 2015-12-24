const skeleton = require('./webpack-skeleton')
const webpack = require('webpack')
const path = require('path')
const JsonpTemplatePlugin = webpack.JsonpTemplatePlugin
const FunctionModulePlugin = require('webpack/lib/FunctionModulePlugin')

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
        loader: 'style-loader!css-loader!stylus-loader'
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

config.target = function renderer (compiler) {
  compiler.apply(
    new JsonpTemplatePlugin(config.output),
    new FunctionModulePlugin(config.output)
  )
}

module.exports = config

