const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/js/main.js',
        estrellas: './src/js/estrellas.js'
    },
    output: {
        filename: '[name]-min.js',
        path: path.resolve(__dirname, 'assets/js')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
