const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    plugins: [new HtmlWebpackPlugin({
        title:'Hugo\'s resume'
    })],
    devtool: "source-map", 
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader", options: 
                {
                    sourceMap: true
                }
            },
            {
                loader: "sass-loader", options: 
                {
                    sourceMap: true
                }
            }]
        }]
    }
};