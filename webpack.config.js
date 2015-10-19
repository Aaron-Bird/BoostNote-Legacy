var webpack = require('webpack')
module.exports = {
  entry: {
    main: './browser/main/index.js'
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    publicPath: 'http://localhost:8090/assets',
    libraryTarget: 'commonjs2'
  },
  devtool: '#inline-source-map',
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  externals: [
    'socket.io-client',
    'md5',
    'superagent',
    'superagent-promise',
    'react',
    'redux',
    'react-redux',
    'react-router',
    'lodash',
    'redbox-react',
    'react-transform-hmr',
    'react-transform-catch-errors',
    'react-select',
    'markdown-it',
    'moment'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', 'styl']
  },
  target: 'atom'
}
