module.exports = {
  entry: {
    main: './browser/main/index.jsx'
  },
  output: {
    filename: '[name].js',
    publicPath: 'http://localhost:8090/assets'
  },
  devtool: '#inline-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'jsx-loader?insertPragma=React.DOM&harmony'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  externals: {
    'react': 'React',
    'react/addons': 'React',
    'react-router': 'ReactRouter',
    'ace': 'ace',
    'reflux': 'Reflux',
    'moment': 'moment'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
