process.env.NODE_ENV = 'prod';
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var copyDir = ['_locales', 'images', 'pages', 'manifest.json'];

module.exports = {
  entry: {
    background: path.join(__dirname, '../src/js/background/index.js'),
    options: path.join(__dirname, '../src/js/options/index.js'),
    content: path.join(__dirname, '../src/js/content/index.js')
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0']
          }
        }
      },
      {
        test: /\.scss|css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader?sourceMap',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new CopyWebpackPlugin(
      copyDir.map(dir => {
        return {
          from: path.join(__dirname, '../src/' + dir),
          to: path.join(__dirname, '../dist/' + dir),
          ignore: ['.*']
        };
      })
    )
  ],
  devtool: false
};
