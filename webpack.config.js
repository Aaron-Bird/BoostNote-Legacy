module.exports = {
  entry: {
    main: './browser/main/index.jsx'
  },
  output: {
    filename: '[name].js', //this is the default name, so you can skip it
    publicPath: 'http://localhost:8090/assets'
  },
  devtool: "#inline-source-map", // Sourcemap
  module: {
    loaders: [
      {
        //tell webpack to use jsx-loader for all *.jsx files
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
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React',
    'react/addons': 'React',
    'react-router': 'ReactRouter',
    'ace': 'ace'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
