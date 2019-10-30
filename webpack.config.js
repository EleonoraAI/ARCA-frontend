var webpack = require('webpack');
var path = require('path');

console.log(process.env.SPARQL_ENDPOINT);
console.log("ciao");

module.exports = {
    entry: ["whatwg-fetch", "./src/index.js"],
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, 'dist'),
        publicPath: "assets"
    },

    devtool: "source-map",

    resolve: {
        extensions: ['.ts', '.tsx', ".webpack.js", ".web.js", ".js"],
        alias: {
            // awful and temporary workaround to reference browser bundle instead of node's, see:
            // https://github.com/wycats/handlebars.js/issues/1102
            "handlebars": path.join(__dirname, 'node_modules', "handlebars", "dist", "handlebars.min.js")
        }
    },

    module: {
        rules: [
            {test: /\.ts$|\.tsx$/, use: ['ts-loader']},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
            {
                test: /\.(jpe?g|gif|png|svg)$/,
                use: [{loader: 'url-loader'}],
            },
            {test: /\.ttl$/, use: ['raw-loader']},
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        proxy: {
            "/sparql-endpoint": {
                target: process.env.SPARQL_ENDPOINT,
                pathRewrite: {
                    '/sparql-endpoint': ''
                },
                changeOrigin: true,
                secure: false,

            },
        },
    },
};
