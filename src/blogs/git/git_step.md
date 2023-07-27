---
title: Git 基本使用
date: 2021-12-22
sidebar: auto
categories: 
 - git
tags:
 - git
---


<!-- more -->
# git基本使用



## 1.本地项目上传git步骤

### 初始化

```
git init
```

### 关联远程仓库

```
git remote add origin + 复制的地址  //本地仓库与Gitee仓库关联
```

### 同步远程仓库（远程仓库已初始化）

```
git pull origin master // (master)仓库名
```

### 添加文件到暂存区

```
git add .   //或者 git add + 文件名
```

### 提交暂存区到本地仓库

```
git commit -m '内容描述'
```

### 上传本地指定分支到远程仓库

```
git push origin master    //(master)仓库名
```

## 2.tag使用步骤

查看是否有标签。

```
git tag
```

然后我们需要先**commit**，才能进行下一步。

创建标签

```
git tag -a v1.0 -m "V1.0"
```

切换到标签

```
git checkout v1.0
```

push到远程仓库

```
git push origin v1.0
```

删除标签

````
git tag -d
````

