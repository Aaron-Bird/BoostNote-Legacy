var webpack = require('webpack')
var path = require('path')
var JsonpTemplatePlugin = webpack.JsonpTemplatePlugin
var FunctionModulePlugin = require('webpack/lib/FunctionModulePlugin')
var NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')
var opt = {
  path: path.join(__dirname, 'compiled'),
  filename: '[name].js',
  sourceMapFilename: '[name].map',
  libraryTarget: 'commonjs2',
  publicPath: 'http://localhost:8080/assets/'
}
var config = {
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader?cacheDirectory',
        exclude: /node_modules/
      },
      {
        test: /\.styl?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },
  debug: true,
  devtool: 'eval-source-map',
  entry: {
    main: './browser/main/index.js',
    finder: './browser/finder/index.js'
  },
  output: opt,
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new NodeTargetPlugin()
  ],
  externals: [
    'electron',
    'socket.io-client',
    'md5',
    'superagent',
    'superagent-promise',
    'lodash',
    'markdown-it',
    'moment',
    'highlight.js',
    'markdown-it-emoji',
    'fs-jetpack'
  ]
}

config.target = function renderer (compiler) {
  compiler.apply(
    new JsonpTemplatePlugin(opt),
    new FunctionModulePlugin(opt)
  )
}

module.exports = config

