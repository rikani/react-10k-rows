const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.common.config');

process.env.NODE_ENV = 'development'

const devConfig = {
  entry: {
    start: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './frontend/js/start.js'
    ]
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('postcss-import')(),
                require('postcss-nested')(),
                require('postcss-calc')(),
              ]
            }
          },
          
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './frontend/html/index.html'
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge(baseConfig, devConfig);