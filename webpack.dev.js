const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const $ = require("jquery");

module.exports = {
    entry: './src/client/index.js',
    mode: 'development',
    devtool: 'source-map',
    output: {
      libraryTarget: 'var',
      library: 'Client'
    },
    stats: 'verbose',
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            },
            {
              //IMAGE LOADER
              test: /\.(jpe?g|png|gif|svg)$/i,
              use: [
                    {
                      loader: 'file-loader',
                      options: {
                        name: '[name].[ext]',
                        outputPath: (url, resourcePath, context) => {
                          let relativePath = path.relative(context, resourcePath);
                          relativePath = relativePath.replace(/\\/g,'/');
                          relativePath = relativePath.replace('src/client/','').replace(`/${url}`,'');
                          return `${relativePath}/${url}`;
                        },
                      }
                    }
                  ]
            },
            {
              test: /\.html$/i,
              loader: 'html-loader',
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
            favicon: 'src/client/images/favicon.png'
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}
