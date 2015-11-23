var webpack = require('webpack')
module.exports = {
  entry: {
    main: './browser/main/index.js',
    finder: './browser/finder/index.js'
  },
  output: {
    path: 'compiled',
    filename: '[name].js',
    // sourceMapFilename: '[name].map',
    libraryTarget: 'commonjs2'
  },
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
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
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
    'markdown-it-emoji'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', 'styl']
  }
}
