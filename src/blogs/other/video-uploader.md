---
title: 大文件切片上传
date: 2022-06-28
sidebar: auto
categories: 
 - 其它
tags:
 - 前端
---

<!-- more -->
# 大文件切片上传

前端部分

```json
// package.json
{
  "name": "client",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "vite"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "vite": "^2.9.12"
  }
}
```



```html
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <p>
            <progress id="uploadProgress" value="0"></progress>
        </p>
        <p>
            <input type="file" id="videoUploader" value="选中视频">
        </p>
        <p>
            <span id="uploadInfo"></span>
        </p>
        <p>
            <button id="uploadBtn">上传</button>
        </p>
        
    </div>
    <script crossorigin="anonymous" integrity="sha512-odNmoc1XJy5x1TMVMdC7EMs3IVdItLPlCeL5vSUPN2llYKMJ2eByTTAIiiuqLg+GdNr9hF6z81p27DArRFKT7A==" src="http://lib.baomitu.com/axios/0.27.2/axios.min.js"></script>
    <script src="./src/app.js" type="module"></script>
</body>
</html>
```

````js
// app.js
// import { UPLOAD_INFO, ALLOWED_TYPE, CHUNK_SIZE, API } from './config'
const BASE_BRL = 'http://localhost:8000'
// 上传地址
const API = {
  UPLOAD_VIDEO:BASE_BRL+'/upload_video'
}
// 信息提示
const UPLOAD_INFO = {
    'NO_FILE':'请选择文件',
    "INVALID_TYPE":'不支持该类型上传文件',
    'UPLOAD_FAILED':'上传失败',
    'UPLOAD_SUCCESS':'上传成功'
}
// 文件格式列表
const ALLOWED_TYPE = {
    'video/mp4':'mp4',
    'video/ogg':'ogg',
    'audio/mpeg':'mp3'
}
// 每一次上传的大小
const CHUNK_SIZE = 64*1024

const oProgress = document.querySelector('#uploadProgress')
const oUploader = document.querySelector('#videoUploader')
const oInfo = document.querySelector('#uploadInfo')
const oBtn = document.querySelector('#uploadBtn')

// 当前上传大小
let uploadedSize = 0

oBtn.addEventListener('click', uploadVideo, false)

// 上传
async function uploadVideo() {
  oUploader.disabled = true
  oBtn.disabled = true
  console.dir();
  // const fs = oUploader.files[0]
  // console.log(fs);
  const {
    files: [file],
  } = oUploader
  if (!file) {
    oUploader.disabled = false
    oBtn.disabled = false
    oInfo.innerText = UPLOAD_INFO.NO_FILE
    return
  }
  // 判断文件是否支持改文件格式
  if (!ALLOWED_TYPE[file.type]) {
    oUploader.disabled = false
    oBtn.disabled = false
    oInfo.innerText = UPLOAD_INFO.INVALID_TYPE
    return
  }
  const { name, type, size } = file
  const fileName = new Date().getTime() + '_' + name.split('.')[0]
  let uploadResult = null
  oProgress.max = size
  oInfo.innerText = ''
  while (uploadedSize < size) {
    const fileChunk = file.slice(uploadedSize, uploadedSize + CHUNK_SIZE)
    const formData = createFormData({
      name,
      type,
      size,
      fileName,
      uploadedSize,
      file: fileChunk,
    })
    try {
      uploadResult = await axios.post(API.UPLOAD_VIDEO, formData)
      console.log(uploadResult.data);
    } catch (error) {
      oUploader.disabled = false
      oBtn.disabled = false
      oInfo.innerText = `${UPLOAD_INFO.UPLOAD_FAILED}:(${error.message})`
      return
    }
    uploadedSize += fileChunk.size
    // 上传的进度
    oProgress.value = uploadedSize
  }
  oInfo.innerText = UPLOAD_INFO.UPLOAD_SUCCESS
  oUploader.value = null
  uploadedSize = 0
  oUploader.disabled = false
  oBtn.disabled = false
}
// 表单数据
function createFormData({ name, type, size, fileName, uploadedSize, file }) {
  const fd = new FormData()
  fd.append('name', name)
  fd.append('type', type)
  fd.append('size', size)
  fd.append('fileName', fileName)
  fd.append('uploadedSize', uploadedSize)
  fd.append('file', file)
  return fd
}

````

后端部分

```json
// package.json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon ./app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1",
    "express-fileupload": "^1.4.0"
  }
}

```

```js
// app.js
const express = require('express')
const bodyParser = require('body-parser')
const uploader = require('express-fileupload')
const { extname,resolve } = require('path')
const { existsSync,appendFileSync, writeFileSync } = require('fs')
const app = express()
const RORT = 8000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(uploader())
// 设置静态文件http://localhost:8000/upload_temp
app.use('/',express.static('upload_temp'))
const ALLOWED_TYPE = {
    'video/mp4':'mp4',
    'video/ogg':'ogg',
    'audio/mpeg':'mp3'
}
// 配置跨域
app.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST,GET')
    next()
})

app.post('/upload_video', (req,res)=>{
    const { name,type,size,fileName,uploadedSize } = req.body
    const { file } = req.files
    // 判断文件是否有数据
    if(!file){
        res.send({
            code:1001,
            msg:'No file uploaded'
        })
        return
    }
    // // 格式判断
    if(!ALLOWED_TYPE[type]){
        res.send({
            code:1002,
            msg:'类型不符合'
        })
        return
    }
    // 文件名 extname(name)获取后缀名
    const filename = fileName + extname(name)
    // 文件名路径 resolve()将路径或路径片段的序列解析为绝对路径
    const filePath = resolve(__dirname,'./upload_temp/' + filename)

    if(uploadedSize!=='0'){
        // 判断有没有这个文件
        if(!existsSync(filePath)){
            res.send({
                code:1003,
                msg:'文件不存在'
            })
            return
        }
        // 追加文件数据
        appendFileSync(filePath,file.data)
        res.send({
            code:0,
            msg:'ok',
            data:{
                video_url:'http://localhost:8000/'+filename
            }
        })
        return
    }
    // 刚开始上传  创建文件并写入一条数据
    writeFileSync(filePath, file.data)
    res.send({
        code:0,
        msg:'文件创建完成'
    })
})
// 监听端口
app.listen(RORT, ()=>{
    console.log('Server is runing on:' +'http://localhost:'+RORT);
})

```

