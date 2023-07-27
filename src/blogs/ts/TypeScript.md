---
title: TypeScript快速上手
date: 2021-12-20
sidebar: auto
categories: 
 - ts
tags:
 - 前端
---

<!-- more -->

[TOC]

# **TypeScript快速上手**

## 1.安装 TypeScript

命令行运行如下命令，全局安装 TypeScript：

```
npm install -g typescript
```

## 2.手动编译ts

src/helloworld.ts

```
function greeter (person) {
  return 'Hello, ' + person
}

let user = 'Yee'

console.log(greeter(user))
```

控制台

```
tsc helloworld.ts
```

输出结果为一个 `helloworld.js` 文件，它包含了和输入文件中相同的 JavsScript 代码。

## 3.自动编译ts


生成配置文件tsconfig.json

```
tsc --init
```

## 4.使用webpack打包TS

### 4.1下载依赖

```
 
npm install -D typescript@4.5.4
npm install -D webpack@4.41.5 webpack-cli@3.3.10
npm install -D webpack-dev-server@3.10.2
npm install -D html-webpack-plugin@4.5.0 clean-webpack-plugin@3.0.0
npm install -D ts-loader@8.0.11
npm install -D cross-env@7.0.2
```

### 4.2入口JS: src/main.ts

```
// import './01_helloworld'

document.write('Hello Webpack TS!')
```

### 4.3index页面: public/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack & TS</title>
</head>
<body>
  
</body>
</html>
```

### 4.4 build/webpack.config.js

```js
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production' // 是否生产环境

function resolve (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    app: './src/main.ts'
  },

  output: {
    path: resolve('dist'),
    filename: '[name].[contenthash:8].js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [resolve('src')]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  devtool: isProd ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',

  devServer: {
    host: 'localhost', // 主机名
    stats: 'errors-only', // 打包日志输出输出错误信息
    port: 8081,
    open: true
  },
}
```

### 4.5package.json配置打包命令

```json
"dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.js",
"build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
```

### 4.6运行and打包

```
npm run dev
npm run build
```

