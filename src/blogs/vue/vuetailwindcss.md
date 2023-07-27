---
title: vue2.6.1安装tailwindcss
date: 2021-12-06
sidebar: auto
categories: 
 - vue
tags:
 - 前端
---

::: tip
css 框架
:::
<!-- more -->


## 1.vue2.6.1安装tailwindcss

> 1.安装tailwindcss

```js
npm install tailwindcss -D
```

> 2.(在项目更目录下)创建tailwind配置文件

```js
npx tailwind init -p
//或者自己创建js文件也行 tailwind.config.js 
```

发现在根目录下多了2个文件.

<img :src="$withBase('/bolgImg/image-20211206104718947.png')" alt="image-20211206104718947" style="zoom:200%;" />

> 3.(在assets目录创建css文件夹)新建tailwind.css文件

```
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```



## 2.出现的问题(运行报错)

<img :src="$withBase('/bolgImg/20210509010024925.png')" alt="image-20211206104718947" style="zoom:200%;" />

### 2.1解决

> 卸载插件

```
npm uninstall tailwindcss postcss autoprefixer
```

> 重新安装

```
npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

> 重启项目

```
npm run serve
```

