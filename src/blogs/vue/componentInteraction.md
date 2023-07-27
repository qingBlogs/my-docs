---
title: vue3.2中setup语法糖组件间通信
date: 2022-06-22
sidebar: auto
categories: 
 - vue
tags:
 - 前端
---

<!-- more -->

# vue3.2中setup语法糖组件间通信

------

## 1.父子组件通信

**`props`**父组件传值

```vue
// 父组件

<template>
  <div>
    <son :msg="state.msg" />
  </div>
</template>

<script setup>
import son from '../components/son.vue'
import { reactive } from 'vue'
const state = reactive({
  msg: '父组件的值'
})
</script>
<style scoped lang="scss"></style>

```

```vue
// 子组件

<template>
  <div>
    {{ msg }}
  </div>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss"></style>
```

**`emit`** 父组件传值

```vue
// 父组件
<template>
  <div>
    <son @myClick="handleClick" />
  </div>
</template>

<script setup>
import son from '../components/son.vue'
const handleClick = (val) => {
  console.log(val)
}
</script>
<style scoped lang="scss"></style>


```

```vue
// 子组件
<template>
  <div>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['myClick'])
const handleClick = () => {
  emit('myClick', '我是子组件的值')
}
</script>

<style scoped lang="scss"></style>
```

**`defineExpose`** 可以得到组件里的方法和变量

```vue
// 父组件

<template>
  <div>
    <son ref="sonRef" />
    <button @click="handleClick">点击</button>
  </div>
</template>

<script setup>
import son from '../components/son.vue'
import { ref } from 'vue'
const sonRef = ref(null)
const handleClick = (val) => {
  console.log(sonRef.value.msg)
}
</script>
<style scoped lang="scss"></style>

```

```vue
// 子组件

<template>
  <div>
    son
  </div>
</template>

<script setup>
defineExpose({
  msg: '我是子组件'
})
</script>

<style scoped lang="scss"></style>

```

`provide` `inject`

```vue
// 父组件

<template>
  <div>
    <son />
  </div>
</template>

<script setup>
import son from '../components/son.vue'
import { provide } from 'vue'
provide('msg', '我是父组件')
</script>
<style scoped lang="scss"></style>

```

```vue
// 子组件
<template>
  <div>
    son
    {{ data }}
  </div>
</template>

<script setup>
import { inject } from 'vue'
const data = inject('msg')
</script>

<style scoped lang="scss"></style>

```

**`attrs`** 可以接受除去 props、style、 class之外的属性

```vue
// 父组件

<template>
  <div>
    <son :msg="state.msg" :hello="state.hello" />
  </div>
</template>

<script setup>
import son from '../components/son.vue'
import { reactive } from 'vue'
const state = reactive({
  msg: '我是父组件',
  hello: 'hello'
})
</script>
<style scoped lang="scss"></style>

```

```vue
// 子组件

<template>
  <div>
    son
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs()
console.log(attrs.msg)  // 我是父组件
console.log(attrs.hello)  // hello
</script>

<style scoped lang="scss"></style>

```

`v-model`

```vue
// 父组件

<template>
  <div>
    <son v-model:msg="state.msg" />
    {{ state.msg }}
  </div>
</template>

<script setup>
import son from '../components/son.vue'
import { reactive } from 'vue'
const state = reactive({
  msg: '我是父组件'
})
</script>
<style scoped lang="scss"></style>

```

```vue
// 子组件

<template>
  <div>
    son
    <button @click="handleClick">点击</button>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'
const props = defineProps({
  msg: {
    type: String,
    default: ''
  }
})
console.log(props.msg)

const emit = defineEmits(['msg'])
const handleClick = () => {
  emit('update:msg', '我是子组件')
}
</script>

<style scoped lang="scss"></style>

```

## 2.父组件调用子组件方法

利用defineExpose+ref 可以得到组件里的方法和变量

```vue
父组件.vue
<template>
  <div>
    <aa ref="testRef"></aa>
    <el-button @click="fatherHandler">调用父组件中的方法</el-button>
  </div>
</template>
<script setup lang="ts">
import { reactive ,ref} from "vue";
import aa from '../components/ChaCao.vue'
const testRef=ref()
const fatherHandler=()=>{
    testRef.value.changeInfoApi({
        name:'白风夕',
        sex:'女'
    })
}
</script>
```

```vue
子组件.vue
<template>
  <div class="main">
       <h2>我是子组件</h2>
        <h2>姓名:{{info.name}}</h2>
      <h2>姓别:{{info.sex}}</h2>
  </div>
</template>
<script setup lang="ts">
import { reactive,defineExpose } from "vue";
let  info=reactive({
    name:'丰兰息',
    sex:'男'
})
// 改变组件的中的方法
const changeInfoApi=(mess:any)=>{
    info.name=mess.name
    info.sex=mess.sex
}
// 将这个方法暴露出去,这样父组件就可以使用了哈
defineExpose({
    changeInfoApi,
})
</script>
```
