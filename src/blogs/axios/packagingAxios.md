---
title: 封装axios 支持ts类型声明
date: 2022-06-26
sidebar: auto
categories: 
 - axios
tags:
 - 前端
---
<!-- more -->

# 封装axios 支持ts类型类型声明

------

1. 在src目录下新建plugins/axios文件夹
2. 在src目录下新建types文件夹（用于存放类型声明文件）

创建`ResponseResult.d.ts`文件

```ts
// 根据实际请求返回的字段
interface ResponseResult<T>{
    code:number|string,
    message?:string
    data:T
}
```

- axios文件夹下 创建 index.ts 和 Axios.ts两个文件

创建`index.ts`文件

```ts

import Axios from "./Axios";

const http = new Axios({
    baseURL:'http://localhost:3000/',
    timeout:5000,
    headers:{}
})

export { http }
```

创建`Axios.ts`文件

```ts
import axios, { AxiosRequestConfig } from 'axios'

export default class Axios {
  private instance
  constructor(config: AxiosRequestConfig) {
    // 初始化Axios 实例
    this.instance = axios.create(config)
    // 添加拦截器
    this.interceptors()
  }
  // 发送请求
  public async request<T, D = ResponseResult<T>>(config: AxiosRequestConfig): Promise<D> {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await this.instance.request<D>(config)
        resolve(res.data)
      } catch (error) {
        reject(error)
      }
    })
  }
  private interceptors(){
    // 请求拦截
    this.interceptorsRequest()
    // 响应拦截器
    this.interceptorsResponse()
  }
  private interceptorsRequest() {
    this.instance.interceptors.request.use(config => {
      //在发送请求之前做些什么
      return config;
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
  }
  private interceptorsResponse() {
    this.instance.interceptors.response.use(response => {
      // 对响应数据做点什么
      return response;
    }, error => {
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      return Promise.reject(error);
    })
  }
}

```