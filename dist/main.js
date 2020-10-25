(function(entryFileObj){
      function require (moduleKey) {
        moduleKey = moduleKey.toString();

        function localRequire (relativePath) {
          return require(entryFileObj[moduleKey].dependencies[relativePath])
        }

        var exports = {};
        (function(require,exports,code){
          
          eval(code);
        })(localRequire,exports, entryFileObj[moduleKey].code)

        return exports;
      }
      require("./src/index.js")

    })({"./src/index.js":{"dependencies":{"./expo.js":"./src\\expo.js"},"code":"\"use strict\";\n\nvar _expo = require(\"./expo.js\");\n\n/*\r\n * @Description: \r\n * @Author: hexy\r\n * @Date: 2020-10-23 21:10:58\r\n * @LastEditors: hexy\r\n * @LastEditTime: 2020-10-23 23:04:14\r\n * @FilePath: \\webpack-test\\src\\index.js\r\n * @Version: Do not edit\r\n */\n// 这个简易webpack 引入的模块文件需写 后缀\nconsole.log('index.js');\nconsole.log((0, _expo.add)(1, 2));\nconsole.log((0, _expo.reduce)(3, 2));"},"./src\\expo.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.reduce = exports.add = void 0;\n\n/*\r\n * @Description: \r\n * @Author: hexy\r\n * @Date: 2020-10-23 21:43:24\r\n * @LastEditors: hexy\r\n * @LastEditTime: 2020-10-23 21:45:50\r\n * @FilePath: \\webpack-test\\src\\expo.js\r\n * @Version: Do not edit\r\n */\nvar add = function add(a, b) {\n  return a + b;\n};\n\nexports.add = add;\n\nvar reduce = function reduce(a, b) {\n  return a - b;\n};\n\nexports.reduce = reduce;"}})