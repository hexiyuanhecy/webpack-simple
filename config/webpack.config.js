/*
 * @Description: 
 * @Author: hexy
 * @Date: 2020-10-23 21:09:22
 * @LastEditors: hexy
 * @LastEditTime: 2020-10-25 21:32:30
 * @FilePath: \webpack-test\config\webpack.config.js
 * @Version: Do not edit
 */
const path = require("path");

 module.exports = {
   entry: "./src/index.js",
   mode: "development",
   output: {
     path: path.resolve(__dirname, "../dist"),
     filename: "main.js"
   }
 }
