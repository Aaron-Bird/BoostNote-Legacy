const skeleton = require('./webpack-skeleton')
const webpack = require('webpack')
const path = require('path')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')

var JsonpTemplatePlugin = webpack.JsonpTemplatePlugin
var FunctionModulePlugin = require('webpack/lib/FunctionModulePlugin')
var config = Object.assign({}, skeleton, {
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
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
    libraryTarget: 'commonjs2',
    sourceMapFilename: '[name].map',
    publicPath: 'http://localhost:8080/assets/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new NodeTargetPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
})

config.target = function renderer (compiler) {
  compiler.apply(
    new JsonpTemplatePlugin(config.output),
    new FunctionModulePlugin(config.output)
  )
}

module.exports = config
