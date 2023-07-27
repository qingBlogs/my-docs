---
title: Git创建远程分支
date: 2021-12-22
sidebar: auto
categories: 
 - git
tags:
 - git
---


<!-- more -->
# Git创建远程分支

新建一个本地分支并切换到当前分支：

```
git checkout -b test（分支名称）
```

查看一下现在的分支状态:

```
git branch
```

<img :src="$withBase('/bolgImg/image-20211222112652731.png')" alt="image-20211222112652731" style="zoom:200%;" />

（*）表示当前所在分支

把新建的本地分支push到远程服务器，远程分支与本地分支同名

```
git push origin test:test
```

切换本地分支

```
git checkout main 
```

删除本地分支

```
git branch -d test // -D强制删除
```

删除远程分支

```
git push origin --delete test
```

