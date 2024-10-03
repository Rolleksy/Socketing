const path = require('path');

module.exports = {
    entry: {
        chat: './src/socketsClient/chatSocketClient.ts',
        menu: './src/socketsClient/menuSocketClient.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/public/js'),
        publicPath: '/js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    mode: 'development'
};