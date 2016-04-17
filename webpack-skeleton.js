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
      'lib': path.resolve(__dirname, 'lib'),
      'browser': path.resolve(__dirname, 'browser')
    }
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new NodeTargetPlugin()
  ],
  stylus: {
    use: [require('nib')()],
    import: [
      '~nib/lib/nib/index.styl',
      path.resolve(__dirname, 'browser/styles/index.styl')
    ]
  },
  externals: [
    'electron',
    'md5',
    'superagent',
    'superagent-promise',
    'lodash',
    'markdown-it',
    'moment',
    'highlight.js',
    'markdown-it-emoji',
    'fs-jetpack',
    'markdown-it-math',
    '@rokt33r/sanitize-html',
    'markdown-it-checkbox',
    'season',
    {
      react: 'var React',
      'react-dom': 'var ReactDOM',
      'react-redux': 'var ReactRedux',
      'redux': 'var Redux'
    }
  ]
}

module.exports = config

