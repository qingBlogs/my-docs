---
title: 节流防抖
date: 2023-02-02
sidebar: auto
categories: 
 - 其它
tags:
 - 前端


---

<!-- more -->

# 节流防抖

- 函数防抖(debounce)：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。


- 函数节流(throttle)：高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率。


- 函数节流（throttle）与 函数防抖（debounce）都是为了限制函数的执行频次，以优化函数触发频率过高导致的响应速度跟不上触发频率，出现延迟，假死或卡顿的现象。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>防抖与节流</title>
  </head>
  <body>
    <button id="throttle">节流</button>
    <button id="debounce">防抖</button>
    <script>
      let bt1 = document.querySelector('#throttle') //声明并绑定一个用来点击的元素
      let bt2 = document.querySelector('#debounce') //声明并绑定一个用来点击的元素
      function fn1() {
        console.log('触发节流')
      }
      function fn2() {
        console.log('触发防抖')
      }
      function throttle(fn, delay) {
        let timer = null
        return function () {
          if (timer) return
          timer = setTimeout(() => {
            fn()
            timer = null
          }, delay)
        }
      }
      function debounce(fn, delay) {
        let timer = null
        return function () {
          if (timer !== null) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            fn()
          }, delay)
        }
      }
      bt1.addEventListener('click', throttle(fn1, 1000)) //绑定一个点击事件
      bt2.addEventListener('click', debounce(fn2, 1000)) //绑定一个点击事件
    </script>
  </body>
</html>

```

