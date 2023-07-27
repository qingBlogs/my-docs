import { navbar } from 'vuepress-theme-hope'

export const zhNavbar = navbar([
  '/',
  {
    text: '目录',
    link: '/blogs/',
  },
  {
    text: '文档',
    icon: 'book',
    children: [
      {
        link: 'https://cn.vuejs.org/',
        text: 'vue官方文档',
      },

      {
        link: 'https://cn.vitejs.dev/',
        text: 'vite官方文档',
      },
      {
        link: 'https://pinia.vuejs.org/zh/',
        text: 'pinia官方文档',
      },
      {
        link: 'https://threejs.org/',
        text: 'threejs文档',
      },
      {
        link: 'https://router.vuejs.org/zh/',
        text: 'VueRouter官方文档',
      },
      {
        link: 'https://element-plus.org/zh-CN/#/zh-CN',
        text: 'element-plus文档',
      },
      {
        link: 'https://theme-hope.vuejs.press/zh/',
        text: 'theme-hope文档',
      },
    ],
  },
])
