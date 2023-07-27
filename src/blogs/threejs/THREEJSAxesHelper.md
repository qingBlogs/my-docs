---
title: threejs 中的全局坐标和局部坐标
date: 2022-09-16
sidebar: auto
categories: 
 - threejs
tags:
 - threejs

---

<!-- more -->

# THREEJS中的全局坐标和局部坐标

```js

const axesHelper0 = new THREE.AxesHelper(2); // 全局坐标
scene.add(axesHelper0)
const axesHelper1: AxesHelper = new AxesHelper(500) // 局部坐标1
const axesHelper2: AxesHelper = new AxesHelper(500)// 局部坐标2
const personClone = (personObject: Group) => {
  // 创建Object3D对象
  const p1 = new Object3D() 
  p1.position.set(50, 0, 20)// 设置局部坐标
  p1.add(axesHelper1)

  const p2 = new Object3D()
  p2.position.set(0, 0, 100) // 设置局部坐标
  p2.add(axesHelper2)

  const cloneObject1 = clone(personObject) // 克隆模型1
  cloneObject1.position.set(0, 0, 0)
  const cloneObject2 = clone(personObject)// 克隆模型2
  cloneObject2.position.set(0, 100, 20)

  p1.add(cloneObject1) // 模型1添加Object3D对象中
  p2.add(cloneObject2) // 模型2添加Object3D对象中
  scene.add(p1, p2) // Object3D添加到场景
}
```

