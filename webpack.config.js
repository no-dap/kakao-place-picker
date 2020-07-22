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
                test: /\.less$/i,
                use: ['style-loader', 'css-loader', 'less-loader', ],
            },
            {
                test: /\.ts$/i,
                use: ['ts-loader', ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader', ]
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