var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: ["whatwg-fetch", "./src/index.js"],
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, 'dist'),
        publicPath: "assets"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".js"],
        alias: {
            // awful and temporary workaround to reference browser bundle instead of node's, see:
            // https://github.com/wycats/handlebars.js/issues/1102
            "handlebars": path.join(__dirname, 'node_modules', "handlebars", "dist", "handlebars.min.js")
        }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        proxy: {
            "/sparql-endpoint": {
                target: process.env.SPARQL_ENDPOINT,
                pathRewrite: {'/sparql-endpoint' : ''},
                changeOrigin: true,
                secure: false,
            },
        },
    },
};
