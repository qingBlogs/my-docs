import { sidebar } from 'vuepress-theme-hope'

export const zhSidebar = sidebar({
  '/': [
    '',
    {
      text: 'vue',
      icon: 'laptop-code',
      prefix: 'blogs/vue',
      link: 'blogs/',
      children: 'structure',
    },
    {
      text: 'axios',
      icon: 'laptop-code',
      prefix: 'blogs/axios',
      children: 'structure',
    },
    {
      text: 'git',
      icon: 'laptop-code',
      prefix: 'blogs/git',
      children: 'structure',
    },
    'intro',
    // 'slides',
  ],
})
