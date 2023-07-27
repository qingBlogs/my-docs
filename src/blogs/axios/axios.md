---
title: POST请求变成OPTIONS的问题
date: 2022-04-07
sidebar: auto
categories: 
 - axios
tags:
 - 前端
---

::: tip
解决在Vue中使用axios POST请求变成OPTIONS的问题
:::
<!-- more -->

# 解决在Vue中使用axios POST请求变成OPTIONS的问题

**axios发起请求，为什么先发送options请求，再发送get/post请求**

**1引起原因**

1，跨域；

2，请求头非默认情况。

**2默认请求头如下**

> Accept
> Accept-Language
> Content-Language
> Last-Event-ID

Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

通常情况下，会将content-Type:application/json;

axios中content-Type默认是application/json;所以在使用axios跨域发请求时，会触发options预请求。

**3.解决方案**

1.可以通过跟后端协调，将所有options放行，此时便能通过post/get请求访问到数据。

2.引入qs模块处理数据

qs.parse()将URL解析成对象的形式

qs.stringify()将对象 序列化成URL的形式，以&进行拼接

1.安装qs

> npm install qs

2.在main.js引入qs

> import qs from 'qs';

