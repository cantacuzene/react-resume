const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


let config = 
{
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
    },
    context: resolve(__dirname, 'src'),
    output: {
      path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},
        {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
        {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
        {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
        {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
        {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
        {test: /(\.css|\.scss|\.sass)$/, loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap']}
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({template: 'index.html.ejs',}),
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
},
  }
  module.exports = config;