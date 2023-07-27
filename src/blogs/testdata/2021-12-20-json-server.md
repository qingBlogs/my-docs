---
title: json-server 基本使用
date: 2022-03-03
sidebar: auto
categories: 
 - 测试
tags:
 - 前端
---

<!-- more -->


# json-server 基本使用

## 1.安装json-server

```bash
npm install json-server -g
```

## 2.启动json-server

```bash
json-server --watch --port 5300 --host 127.0.0.1 db.json

// --watch 监听db.json文件变化
// --port 指定端口
// --host 指定域名
// db.json json数据文件
```

***启动后生成的db.json文件内容***

```json
{
  "posts": [
    {
      "id": 1,
      "title": "json-server",
      "author": "typicode"
    }
  ],
  "comments": [
    {
      "id": 1,
      "body": "some comment",
      "postId": 1
    }
  ],
  "profile": {
    "name": "typicode"
  },
  //
  "new": [
    {
      "name": "明定即除须",
      "id": 1
    }
  ]
}
```

## 3.apipost测试数据

<img :src="$withBase('/bolgImg/json-server/getdata.png')" alt="image-20211222112652731" style="zoom:200%;border-radius:1%;" />

### 获取单条数据

<img :src="$withBase('/bolgImg/json-server/getonedata.png')" alt="image-20211222112652731" style="zoom:200%;border-radius:1%;" />

### 添加数据

<img :src="$withBase('/bolgImg/json-server/adddata.png')" alt="image-20211222112652731" style="zoom:200%;border-radius:1%;" />

### 更新数据

<img :src="$withBase('/bolgImg/json-server/updata.png')" alt="image-20211222112652731" style="zoom:200%;border-radius:1%;" />

### 删除数据

<img :src="$withBase('/bolgImg/json-server/delete.png')" alt="image-20211222112652731" style="zoom:200%;border-radius:1%;" />

## 4.批量生成数据

```bash
// 初始化package.json文件
yarn init
// 安装 mockjs
yarn add mockjs
```

参考:[Mockjs文档](http://mockjs.com/)

新建db.js

```js
const Mock = require("mockjs")

const Random = Mock.Random

module.exports = () => {
  let data = { news: [] }

  for (let i = 0; i < 20; i++) {
    data.news.push({
      id: i,
      content: Random.csentence(),
    })
  }
  return data
}

```

运行

```
json-server --watch --port 5300 --host 127.0.0.1 db.js
```

