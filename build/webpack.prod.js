const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = require('../config/build')

const config = {
    node: {
        Buffer: false
    },
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: 'static/[name].[hash:8].js',
        publicPath:'/'
    },
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            // 如果使用 vue.common.js 会导致渲染不出来
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    module: {
        rules: [{
                // 仅仅处理 css 文件, css-loader 是处理, postcss-loader 是加前缀
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    // fallback: "style-loader",
                    use: 'css-loader?minimize!postcss-loader'
                })
            }, {
                // 我之前以为, 这个玩意会去把 .vue 文件里面所有的 less 都干掉, 但是现在明显不是
                // 它只会处理单独的 less 文件
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    // fallback: "style-loader",
                    use: 'css-loader?minimize!postcss-loader!less-loader'
                })
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.resolve(process.cwd(), 'src')],
            },

            {
                // 如果需要将 vue 文件中的 css, less 拿出来, 应该处理这个玩意
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader?minimize',
                            // fallback: 'vue-style-loader'
                        }),
                        less: ExtractTextPlugin.extract({
                            use: 'css-loader?minimize!postcss-loader!less-loader',
                            // fallback: 'vue-style-loader'
                        })
                    }
                }
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1000 * 5,
                    name: 'static/[name].[hash:7].[ext]'
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1000 * 5,
                    name: 'static/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [

        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // 干掉打包的时候出现的 warnings
                warnings: false
            },
            // 干掉注释
            comments: false
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true
        }),
        new ExtractTextPlugin('static/style.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module, count) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        // 定义全局变量
        new webpack.DefinePlugin({
            'process.env': env
        })
    ]
};

module.exports = config;