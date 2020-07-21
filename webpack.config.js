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
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    devServer: {
        stats: "errors-only",
        host: process.env.HOST,
        port: 4200,
        open: true
    }
}