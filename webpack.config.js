const path = require('path')

module.exports = {
    entry: '/client/src/index.js',
    target: ['web'],
    output: {
        path: path.join(__dirname, './client/dist'),
        filename: 'index_bundle.js',
        publicPath: 'http://localhost:8080/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env',
                        {
                            'useBuiltIns': 'usage',
                            'corejs': 3
                        }],
                        '@babel/preset-react'
                    ]
                }

            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}