const webpack = require('webpack')
const path = require('path')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')

var config = {
  entry: {
    main: './browser/main/index.js',
    finder: './browser/finder/index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
    alias: {
      'boost': path.resolve(__dirname, 'lib')
    }
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

module.exports = config

