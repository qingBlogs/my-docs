---
title: threejs 模型加载与克隆
date: 2022-09-13
sidebar: auto
categories: 
 - threejs
tags:
 - threejs
---


<!-- more -->
# threejs 模型加载与克隆

```js
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js'
var loader = new THREE.FBXLoader();
  loader.load( '../model/fbx/Samba Dancing.fbx', function ( object ) {
      //动画
      mixers=object.mixer = new THREE.AnimationMixer( object );
      var action = object.mixer.clipAction( object.animations[0]);
      action.play();
      object.traverse( function ( child ) {
          if ( child.isMesh ) {
              child.castShadow = true;
              child.receiveShadow = true;
          }
      } );
      //缩放
      object.scale.set(0.5,0.5,0.5);
      //位置
      object.position.set(0,0,0);
      scene.add( object ); 
       //模型复制,如果需要大量复制，刻在下面进行循环
        let meshBox = SkeletonUtils.clone(object)
        meshBox.animations = object.animations
        meshBox.mixer = new THREE.AnimationMixer(meshBox)
        const action2 = meshBox.mixer.clipAction(meshBox.animations[0])
        action2.play()
        meshBox.position.set(0, 20, 0)
        meshBox.scale.set(0.5, 0.5, 0.5)
        sceneFish.add(meshBox)
  } );
```

**单个网格克隆**

```js
/**
 * 创建网格模型
 * 克隆几何体
 */
var box=new THREE.BoxGeometry(10,10,10);//创建一个立方体几何对象
var box2 = box.clone();//克隆几何体
box.translate(20,0,0);//平移源几何体
var material=new THREE.MeshLambertMaterial({color:0x0000ff});//材质对象—蓝色
var material2=new THREE.MeshLambertMaterial({color:0xff0000});//材质对象—红色
var mesh=new THREE.Mesh(box,material);//网格模型对象
var mesh2=new THREE.Mesh(box2,material2);//克隆网格模型对象
scene.add(mesh);//网格模型添加到场景中
scene.add(mesh2);//克隆的网格模型添加到场景中
```

