/*
 * @Description: 
 * @Author: hexy
 * @Date: 2020-10-23 21:25:40
 * @LastEditors: hexy
 * @LastEditTime: 2020-10-25 21:41:40
 * @FilePath: \webpack-test\lib\webpack.js
 * @Version: Do not edit
 */
const fs = require('fs'); // node 核心模块
const path = require('path'); // node 核心模块
const { parse } = require('@babel/parser'); // 读取文件
const traverse = require('@babel/traverse').default; // 分析文件内容
const { transformFromAst } = require("@babel/core");

module.exports = class Webpack {

  constructor(webpackOption) {
    const { entry, output } = webpackOption;
    this.entry = entry;
    this.output = output;

    this.modules = [];
  }

  build () {
    const info = this.parseFile(this.entry);
    this.modules.push(info);

    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i];
      const { dependencies } = item;
      if (dependencies) {
        for (const key in dependencies) {
          if (dependencies.hasOwnProperty(key)) {
            const tempPath = dependencies[key];
            this.modules.push(this.parseFile(tempPath))
          }
        }
      }
    }

    // 数据结构转换
    const obj = {};
    this.modules.forEach(({ entryFile, dependencies, code }) => {
      obj[entryFile] = {
        dependencies,
        code
      }
    });
    console.log(obj)

    this.file(obj);

  }

  parseFile (entryFile) {
    // 读取文件内容 
    const fileContent = fs.readFileSync(entryFile, 'utf-8');

    // 利用 @babel/parser 里的parse 分析文件，区分依赖、依赖路径等
    const ast = parse(fileContent, {
      sourceType: 'module'
    });

    const dependencies = {}; // 依赖文件路径对象

    traverse(ast, {
      ImportDeclaration ({ node }) { // import node的type 值为函数名
        const entryFileDirName = path.dirname(entryFile); // 入口文件所在路径
        const entryFileDependencyFilePath = node.source.value; // 入口文件依赖文件的路径
        const newFileName = path.join(entryFileDirName, entryFileDependencyFilePath);
        dependencies[entryFileDependencyFilePath] = "./" + newFileName;
      }
    });

    // 将文件内容编译 转换ast
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    });

    return {
      entryFile,
      dependencies,
      code
    }
  }

  file (entryFileObj) {
    // 生成打包文件
    const entryFileObjStr = JSON.stringify(entryFileObj);

    const filePath = path.join(this.output.path, this.output.filename);
    
    const bundle = `(function(entryFileObj){
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
      require(${JSON.stringify(this.entry)})

    })(${entryFileObjStr})`;

    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
};
