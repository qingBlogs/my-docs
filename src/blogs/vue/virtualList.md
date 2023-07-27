---
title: 虚拟列表
date: 2022-6-26
sidebar: auto
categories: 
 - vue
tags:
 - 前端
---

::: tip
长列表数据展示优化方案
:::
<!-- more -->

# 虚拟列表

## 1.什么是虚拟列表

虚拟列表就是**只对可见区域进行渲染**，对非可见区域中的数据不渲染或部分渲染，以实现减少消耗，提高用户体验的技术。它是长列表的一种优化方案，性能良好。

## 2.使用场景

后端返回十万条数据，最终以长列表方式展示

## 3.问题分析

由于最终效果需要是一个长列表的形式，那么常规的分页渲染，显然是不符合要求的。

## 4.实现思路：

- 写一个代表可视区域的div，固定其高度，通过overflow使其允许纵向 Y 轴滚动。
- 第二步，计算区域中可以显示的数据条数。这个可以用可视区域的高度除以单条数据高度得到。
- 监听滚动，当滚动条变化时，计算出被卷起的数据的高度。
- 计算区域内数据的起始索引，也就是区域内的第一条数据：这个用卷起的高度除以单条数据高度可以拿到。
- 计算区域内数据的结束索引。通过起始索引+可显示的数据的条数可以拿到。
- 取起始索引和结束索引中间的数据，渲染到可视区域。
- 计算起始索引对应的数据在整个列表中的偏移位置并设置到列表上。

整个步骤下来，最终的效果是：**不论怎么滚动，我们改变的只是滚动条的高度和可视区的元素内容。每次只会渲染一个固定的条数，不会增加多余元素。**



```vue
<script setup lang="ts">
import { ref } from 'vue';
import UserApi from '../apis/userApi'
const res = await UserApi.info() // 请求数据

let showList=ref<{id:number,name:string,age:string}[]>([])  // 可视区域显示的数据
const contentHeight=ref(500)  // 可视区域高度
const itemHeight=ref(30)  // 每条数据所占高度
const showNum = ref(0) // 可是区域显示的最大条数
let top = ref(0) // 偏移量
let scrollTop = ref(0) // 卷起的高度
let startIndex = ref(0) // 可视区域第一条数据的索引
let endIndex = ref(0) // 可视区域最后一条数据后面那条数据的的索引，因为后面要用slice(start,end)方法取需要的数据，但是slice规定end对应数据不包含在里面

const scroll =()=>{
  scrollTop.value = document.querySelector('.content_box')?.scrollTop as number
  getShowList()
}
const getShowList = ()=>{
  // 可视区域最多出现的数据条数，值是小数的话往上取整，因为极端情况是第一条和最后一条都只显示一部分
  showNum.value = Math.ceil(contentHeight.value/itemHeight.value)
  // 可视区域第一条数据的索引
  startIndex.value = Math.floor(scrollTop.value/itemHeight.value)
  // 可视区域最后一条数据的后面那条数据的索引
  endIndex.value = startIndex.value+showNum.value
  //可视区域显示的数据，即最后要渲染的数据。实际的数据索引是从startIndex到endIndex
  showList.value = res.data.list.slice(startIndex.value,endIndex.value)
  // 在这需要获得一个可以被itemHeight整除的数来作为item的偏移量，这样随机滑动时第一条数据都是完整显示的
  const offsetY = scrollTop.value - (scrollTop.value % itemHeight.value)
  top.value = offsetY
  console.log(showNum.value)
  
}
getShowList()
</script>

<template>
  <div :style="{height: `${contentHeight}px`}" class="content_box" @scroll="scroll">
    <!-- 这层div是为了把高度撑开，让滚动条出现，height值为所有数据总高 -->
    <div class="data_all" :style="{'height': `${itemHeight*(res.data.list.length)}px`}">
      <div class="data_portion" :style="{'top': `${top}px`}">
        <div class="item" v-for="(item,index) of showList" :key="index">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content_box{
    overflow: auto;
    width: 700px;
    border: 1px solid red;
}
.data_all{
  position: relative;
}
.data_portion{
  position: absolute
}
.item{
    /* 绑定响应式数据 */
    height:v-bind(itemHeight+"px");
    padding: 5px;
    color: #666;
    box-sizing: border-box;
}
</style>

```



