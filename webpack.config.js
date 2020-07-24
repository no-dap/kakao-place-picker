const path = require('path');

module.exports = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'KakaoPlacePicker.min.js',
        libraryTarget: "var",
        library: 'KakaoPlacePicker'
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: ['ts-loader', ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader', ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath:'img/'
                    }
                }]
            },
            {
                test: /\.css$/i,
                use: [{
                    loader: 'css-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'style/',
                        publicPath: 'style/'
                    }
                }]
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', ]
    },
    devServer: {
        stats: "errors-only",
        host: process.env.HOST,
        port: 4200,
        open: true
    }
}