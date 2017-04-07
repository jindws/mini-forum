var webpack = require('webpack')
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        apps: './src/app/app.jsx',
        common: [
            "whatwg-fetch",
            "react",
            "normalize.css",
            "babel-polyfill",
            "redux",
            "react-dom",
            "react-redux",
            "react-router-dom",
            "mongoose",
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },

    devServer: {
        historyApiFallback: true,
        noInfo: true,
        inline: true
    },

    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }, {
                test: /\.(css)$/,
                // loader: "style-loader!css-loader!postcss-loader!sass-loader"
                loader: "style-loader!css-loader!postcss-loader"
            }, {
                test: /\.less$/,
                loader: "style-loader!css-loader!postcss-loader!less-loader"
            }
        ]
    },

    devtool: 'hidden-source-map',
    // devtool: 'eval',
    // watch: true,
    performance: {
        hints: false
    },
    target: 'web',
    plugins: [
        // 开发环境配置
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({template: './index.html'}),
        new webpack.ProvidePlugin({md5:'md5'}),
        new webpack.optimize.CommonsChunkPlugin({names: ['common'], minChunks: Infinity}),
        new webpack.BannerPlugin("Copyright Jindw inc.")
    ]
}
