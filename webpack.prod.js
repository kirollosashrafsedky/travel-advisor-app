const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const WorkboxPlugin = require('workbox-webpack-plugin');
const $ = require("jquery");

module.exports = {
    entry: './src/client/index.js',
    optimization: {
      minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    output: {
      libraryTarget: 'var',
      library: 'Client'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
        new MiniCssExtractPlugin({ filename: "[name].css" }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        // new WorkboxPlugin.GenerateSW(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}
