const webpackOption = require("../config/webpack.config");
const Webpack = require("../lib/webpack.js");

new Webpack(webpackOption).build();
