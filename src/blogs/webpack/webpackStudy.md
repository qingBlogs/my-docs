---
title: webpack基本使用
date: 2022-6-13
sidebar: auto
categories: 
 - webpack
tags:
 - 前端
---


<!-- more -->

# webpack使用

1. 初始化工程

   ```
   npm init -y // 初始化工程，生成package.json 文件
   ```

2. 安装webpack

   ```
   npm i webpack webpack-cli -D 
   ```

## 1.webpack 核心模块

- entry：入口
- output：出口
- module：配置 loader 处理非js文件打包
- plugins：插件，处理任务，删除，压缩，复制等
- mode：模式，development（开发）production（生产）

## 2.webpack默认配置文件：webpack.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: [
        '@babel/polyfill',
        './src/index.js'
    ],
    output: {
        // 打包文件名
        filename: 'js/bundle.js',
        // 打包后的路径，必须是绝对路径
        path: path.resolve(__dirname, 'dist')
    },
    // development（开发）production（生产）
    mode:'development',
    // webpack-dev-server配置
    devServer:{
        open: true,
        static: 'public',
        port: 5000,
        hot: true,
        compress: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./src/index.html'
        })
    ],
    // 配置loader
    module:{
        rules:[
            {
                test:/\.css$/,
                // user 从右往左
                use:['style-loader',{
                    loader:'css-loader',
                    options:{
                        esModule:false
                    }
                }],
            },
            {
                test:/\.less$/,
                // user 从右往左
                use:['style-loader','css-loader','less-loader']
            },
            {
                test:/\.scss$/,
                // user 从右往左
                use:['style-loader','css-loader','sass-loader']
            },
            {
                test:/\.(png|jpg)$/,
                // user 从右往左
                loader:'url-loader',
                // 配置项
                options:{
                    esModule:false,
                    // 如果大于 16kb 的图片就不处理 base64
                    limit:16*1024,
                    // 修改打包图片的名字
                    name:'[hash:4].[ext]',
                    // 配置图片输出路径
                    outputPath:'imgs'
                }
            },
            {
                test:/\.html$/,
                loader:'html-loader',
                options:{
                    esModule: false,
                }
            },
            {
                test:/\.js$/,
                loader:'babel-loader',
                // 除了这个文件夹之外的文件
                exclude:/node_modules/,
                options: {
                    presets: ['@babel/env']
                }
            }
        ]
    },
    devtool:'eval-cheap-module-source-map'
}

// 通过 命令指定webpack配置
// webpack --config 指定配置文件名称
```

- 监听文件自动编译

  ```
  watch
  // 方式一 package.json scripts下配置脚本 webpack --watch 
  // 方式二 在webpack.config.js 添加watch:true
  ```

  ```
  // webpack-dev-server 安装
  npm i webpack-dev-server -D
  
  webpack-dev-server的其它配置
    --open 打开默认浏览器
    --static 指定文件夹开启服务
    --port 指定端口
    --compress 压缩代码
    --hot 热更新
  1.默认将根目录下面的 public 文件夹开启服务
  	webpack-dev-server --static src // 指定src 目录开启静态服务
  2. 将打包好的文件，放在内存里面
  
  package.json scripts下配置脚本 webpack-dev-server
  
  ```

  

- 插件 html-webpack-plugin

  ```
  // 1.安装
  npm i html-webpack-plugin -D
  // 2.导入 webpack.config.js
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  // 3.使用 webpack.config.js
  plugins:[
  	new HtmlWebpackPlugin({
  		filename:文件名,
  		template:模板
  	})
  ]
  
  html-webpack-plugin 做了什么事情
  1·通过模板生成一个 html
  2.将 html 文件存在内存中
  3.自动打包好的js 文件引入到html中
  ```

  

## 3.处理css文件

1. css 文件需要用到工具处理（loader）
2. loader 就是将 非js 文件模块化

```
-安装
npm i css-loader style-loader -D

// css-loader: 将css 模块化
// style-loader: 将css 通过 style 标签的形式，引入到html 里面
1.引入css 文件需要在js 中引入
2.js 本身具备模块化，但css没有
3.需要使用 loader 去处理css 的模块化
4.使用两个 loader: style-loader css-loader
5.css-loader 是将css 文件模块化
6.style-loader 是将css模块化后的文件引入到html里面
-配置：webpack.config.js
module:{
        rules:[
            {
                test:/\.css$/,
                // user 从左往右
                use:['style-loader','css-loader']
            } 
        ]
    }
```

## 4.处理less文件

```
1.安装 less less-loader
npm i less less-loader -D

less：解析less 语法
less-loader：将less转成css

2.配置：webpack.config.js
module:{
        rules:[
            {
                test:/\.less$/,
                // user 从左往右
                use:['style-loader','css-loader','less-loader']
            }
        ]
    }
```

## 5.处理sass文件

```
1.安装 node-sass sass-loader
npm i node-sass sass-loader -D

node-sass：解析sass 语法
sass-loader：将sass转成css

2.配置：webpack.config.js
module:{
        rules:[
            {
                test:/\.less$/,
                // user 从左往右
                use:['style-loader','css-loader','sass-loader']
            }
        ]
    }
```

## 6.处理图片

```
展示图片的三种方式
1.使用背景图片
2.使用js 导入
3.img标签
安装 file-loader url-loader
npm i file-loader url-loader html-loader -D

配置：webpack.config.js
module:{
        rules:[
            {
                test:/\.(png|jpg)$/,
                // user 从左往右
                loader:'url-loader',
                // 配置项
                options:{
                    esModule:false,
                    // 如果大于 16kb 的图片就不处理 base64
                    limit:16*1024,
                    // 修改打包图片的名字
                    name:'[hash:4].[ext]',
                    // 配置图片输出路径
                    outputPath:'imgs'
                }
            },
            {
            	//加载html url图片
                test:/\.html$/,
                loader:'html-loader',
                options:{
                    esModule: false,
                }
            }
        ]
    }
```

## 7.webpack babel配置

- babel 作用就是将高版本的js语法，转成低版本浏览器能支持的语法

安装:babel-loader @babel/core(核心代码) @babel/preset-env

```
npm i babel-loader @babel/core @babel/preset-env -D

在webpack.config.js中配置
module:{
        rules:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                // 除了这个文件夹之外的文件
                exclude:/node_modules/,
                options: {
                    presets: ['@babel/env']
                }
            }
        ]
    }


npm i @babel/polyfill -S  // 对象方法，数组方法
方法一
webpack.config.js中entry
entry: [
        '@babel/polyfill',
        './src/index.js'
    ],
方法二 js文件直接引入
import '@babel/polyfill'
```

## 8.SourceMap

SourceMap：源码映射，将打包好的代码，通过sourceMap映射源文件所在的位置

在webpack.config.js 文件中配置

devtool: 值

1.**`eval`**    ：生成后的代码 -->不生成map文件

2.**`eval-source-map`**   :源代码 -->不生成map文件

3.**`cheap-source-map`**  :生成后的代码  -->生成 map 文件

4.**`source-map`**  :源代码-->生成map文件

5.**`eval-cheap-module-source-map`**  :源代码 --> 不生成 map

## 9.webpack 多页面打包

> 多页面打包的核心：有多个入口，就有多个出口

webpack.config.js

```
// 多个入口，就会有多个出口
    entry: {
        home:'./src/js/home.js',
        aboutMe:'./src/js/aboutMe.js',
    },
    output: {
        // 打包文件名
        filename: 'js/[name].js',
        // 打包后的路径，必须是绝对路径
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // 配置home 页
        new HtmlWebpackPlugin({
            filename:'home.html',
            template:'./src/pages/home.html',
            // 每个页面只加载自己的js
            chunks:['home']
        }),
        new HtmlWebpackPlugin({
            filename:'aboutMe.html',
            template:'./src/pages/aboutMe.html',
            chunks:['aboutMe']
        })
    ],
```

## 10.webpack 全局引入三方库

1. 安装 npm i jquery
2. 导入 import $ from 'jquery'
3. 使用$

由于 第三方库 所有页面都要用到，需要挂载在全局的window上

方法：

1. 配置webpack.config.js

```
const webpack = require('webpack');
plugins: [
	new webpack.ProvidePlugin({
            $: 'jquery',
        }),
]
```

## 11.webpack 生产环境与开发环境

由于 生产打包 和开发打包的配置项不一样，所以需要指定webpack配置

webpack.config.js

拆成三个文件

> webpack.base.js // webpack的基本文件
>
> webpack.dev.js //webpack 开发配置文件
>
> webpack.pro.js // webpack 生产配置文件

**webpack 需要合并配置文件**

安装插件  webpack-merge

```
npm i webpack-merge -D
```

1. 在根目录下新建build目录
2. **package.json**

**`--config`** 指定webpack配置文件

```
"scripts": {
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
  },
```

`webpack.base.js`

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
module.exports = {
    // 多个入口，就会有多个出口
    entry: {
        home:'./src/js/home.js',
        aboutMe:'./src/js/aboutMe.js',
    },
    output: {
        // 打包文件名
        filename: 'js/[name].js',
        // 打包后的路径，必须是绝对路径
        path: path.resolve(__dirname, 'dist')
    },
    // webpack-dev-server配置
    plugins: [
        // 配置home 页
        new HtmlWebpackPlugin({
            filename:'home.html',
            template:'./src/pages/home.html',
            // 每个页面只加载自己的js
            chunks:['home']
        }),
        new HtmlWebpackPlugin({
            filename:'aboutMe.html',
            template:'./src/pages/aboutMe.html',
            chunks:['aboutMe']
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
    ],
    // 配置loader
    module:{
        rules:[
            {
                test:/\.css$/,
                // user 从左往右
                use:['style-loader',{
                    loader:'css-loader',
                    options:{
                        esModule:false
                    }
                }],
            },
            {
                test:/\.less$/,
                // user 从左往右
                use:['style-loader','css-loader','less-loader']
            },
            {
                test:/\.scss$/,
                // user 从左往右
                use:['style-loader','css-loader','sass-loader']
            },
            {
                test:/\.(png|jpg)$/,
                // user 从左往右
                loader:'url-loader',
                // 配置项
                options:{
                    esModule:false,
                    // 如果大于 16kb 的图片就不处理 base64
                    limit:16*1024,
                    // 修改打包图片的名字
                    name:'[hash:4].[ext]',
                    // 配置图片输出路径
                    outputPath:'imgs'
                }
            },
            {
                test:/\.html$/,
                loader:'html-loader',
                options:{
                    esModule: false,
                }
            },
            {
                test:/\.js$/,
                loader:'babel-loader',
                // 除了这个文件夹之外的文件
                exclude:/node_modules/,
                options: {
                    presets: ['@babel/env']
                }
            }
        ]
    },
}
```

`webpack.dev.js`

```js
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
module.exports = merge(baseConfig,{
    // development（开发）production（生产）
    mode:'development',
    // webpack-dev-server配置
    devServer:{
        open: true,
        static: 'public',
        port: 5000,
        hot: true,
        compress: true
    },
    devtool:'eval-cheap-module-source-map'
})
```

`webpack.prod.js`

```js
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
    // development（开发）production（生产）
    mode:'production',
})

```

运行npm run build 后会打包在build文件夹下面 如何解决

```js
output: {
        // 打包文件名
        filename: 'js/[name].js',
        // 打包后的路径，必须是绝对路径
        path: path.resolve(__dirname, '../dist')
    },
```

## 12.webpack处理跨域问题

> 浏览器同源策略：域名 协议 端口 三者有一个不同就会出现跨域

解决跨域方案

- CORS 处理 （后端）
  - 问题：数据不安全
- JSONP （前端） 利用script 标签 src 属性实现跨域
  - 问题：只能处理get请求
- Nginx 反向代理
- 使用webpack   代理

`webpack.dev.js`

```js
devServer:{
        proxy: {
            "/api":"http://localhost:666"
        }
    },
```

## 13.css 文件分离

1.下载 `npm i mini-css-extract-plugin -D`

> 将之前的style-loader 替换成 MiniCssExtractPlugin.loader

webpack.base.js

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
{
plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        })
    ],
module:{
      	rules:[
      		{
                test:/\.css$/,
                // user 从右往左
                use:[{
                    loader:MiniCssExtractPlugin.loader
                },{
                    loader:'css-loader',
                    options:{
                        esModule:false
                    }
                }],
            },{
                test:/\.less$/,
                // user 从右往左
                use:[{
                    loader:MiniCssExtractPlugin.loader
                },'css-loader','less-loader']
            },
            {
                test:/\.scss$/,
                // user 从右往左
                use:[{
                    loader:MiniCssExtractPlugin.loader
                },'css-loader','sass-loader']
            },
      	]
	}
}
```
