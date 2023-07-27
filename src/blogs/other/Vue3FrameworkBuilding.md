---
title: Vue3项目团队开发框架搭建
date: 2023-02-28
sidebar: auto
categories:
  - 其它
tags:
  - 前端
---

<!-- more -->

# Vue3 项目团队开发框架搭建

> vite、eslint、prettierrc、husky、commitlint、lint-staged、stylelint

## 1.使用 vite 初始化项目

```
pnpm create vite

修改vite.config.ts 修改域名端口，自动启动浏览器
server: {
  host: 'localhost',
  port: 9999,
  open: true
}
```

## 2.代码加入 eslint 校验与自动格式化

> [ESLint - 插件化的 JavaScript 代码检测工具 - ESLint 中文文档 (bootcss.com)](https://eslint.bootcss.com/)
>
> eslint 运行代码前就可以发现一些语法错误和潜在规则。保障团队代码一致性

> [Prettier 中文网 · Prettier 是一个“有态度”的代码格式化工具](https://www.prettier.cn/)
>
> prettier 代码格式化工具，用于检测代码中的格式问题

> 区别和联系：ESlint 偏向于把控项目的代码质量 而 Prettier 更偏向于统一项目的编码风格，Eslint 有小部分的代码格式化功能，一般和 Prettier 结合使用

## 3.配置 eslint 和 prettier

**1.eslint 验证代码是否符合定义的规范**

需要安装以下插件

- `eslint-plugin-vue`：vue.js 的 Eslint 插件（查找 vue 语法错误，发现错误指令，查找违规风格指南）
- `eslint-plugin-prettier`：运行更漂亮的 Eslint，使 prettier 规则优先级更高，Eslint 优先级低
- `eslint-config-prettier`：让所有与 prettier 规则存在冲突的 Eslint rules 失效，并使用 prettier 进行代码检查
- `@babel/eslint-parser`：该解析器允许使用 Eslint 校验所有 babel code

首先安装 eslint

```css
pnpm i -D eslint
复制代码
```

生成配置文件

```csharp
// 生成配置文件，.eslintrc.js
npx eslint --init
```

<img :src="$withBase('/bolgImg/other/image-20230208095122839.png')" alt="image-20230208095122839" style="zoom:100%;" />
再安装下面的依赖

```
pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier @babel/eslint-parser
```

修改配置文件如下`.eslintrc.cjs`

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'space-before-function-paren': ['error', 'never'],
    'no-extra-semi': 0, // 结尾不要分号
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-types': 0
  }
}
```

配置`.eslintignore` 防止校验打包的产物

```
// .eslintignore 配置, 防止校验打包的产物
dist
node_modules
```

在 package.json 中添加运行脚本

```json
"scripts": {
    "lint": "eslint src",
    "fix": "eslint src --fix",
}
```

**2.pretter 格式化代码符合定义的规范**

安装包

```
pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier
```

新建`.prettierrc.json`

```json
{
  "singleQuote": true,
  "semi": false,
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "auto",
  "trailingComma": "none",
  "tabWidth": 2
}
```

测试一下代码检查是否生效了，我们在 main.ts 中修改成如下内容

<img :src="$withBase('/bolgImg/other/image-20230208100559743.png')" alt="image-20230208100559743" style="zoom:100%;" />

## 4.vscode 保存文件自动修复代码

直接在项目的跟路径创建.vscode/settings.json 文件，然后在其中加入以下配置。

```
{
    // 开启自动修复
    "editor.codeActionsOnSave": {
        "source.fixAll": false,
        "source.fixAll.eslint": true
    }
}
```

## 5.配置 husky

在上面我们已经集成好了我们代码校验工具，但是需要每次手动的去执行命令才会格式化我们的代码。如果有人没有格式化就提交了，那这个规范就没什么用。所以我们强制让开发人员按照代码规范来提交。

要做到这件事情，可以利用 husky 来在代码提交之前出发 git hook，然后执行`pnpm format`来自动的格式化我们的代码。

安装`husky`

```
pnpm install -D husky
```

> 保证工作区中有.git 目录

执行

```
npx husky-init
```

会在根目录下生成个一个.husky 目录，在这个目录下面会有一个 pre-commit 文件，这个文件里面的命令在我们执行 commit 的时候就会执行

安装`lint-staged`

```
pnpm install -D lint-staged
```

package.json 配置命令

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx,vue}": ["prettier --write", "eslint --fix", "git add"]
  }
}
```

在.husky/pre-commit 文件添加命令

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

## 4.配置 commitlint 校验提交信息

安装包

```
pnpm add @commitlint/config-conventional @commitlint/cli -D
```

添加配置文件，新建`commitlint.config.cjs`(注意是 cjs)，然后添加下面的代码

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 校验规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'conflict',
        'font',
        'delete',
        'stash'
      ]
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72]
  }
}
```

配置 scripts

```json
# 在scrips中添加下面的代码
{
"scripts": {
    "commitlint": "commitlint --config commitlint.config.cjs -e -V"
  },
}
```

配置 husky 信息

```
npx husky add .husky/commit-msg
```

在生成的 commit-msg 文件中添加下面的命令

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint
```

## 5.commit message 格式规范

commit message 由 Header、Body、Footer 组成。

```
<Header>

<Body>

<Footer>
```

#### Header

Header 部分包括三个字段 type（必需）、scope（可选）和 subject（必需）。

```
<type>(<scope>): <subject>
```

##### type

type 用于说明 commit 的提交类型（必须是以下几种之一）

| **值**   | 描述                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| feat     | 新增一个功能                                                                           |
| fix      | 修复一个 Bug                                                                           |
| docs     | 文档变更                                                                               |
| style    | 代码格式（不影响功能，例如空格、分号等格式修正）                                       |
| refactor | 代码重构                                                                               |
| perf     | 优化、改善性能                                                                         |
| test     | 测试                                                                                   |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）                           |
| ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 变更构建流程或辅助工具                                                                 |
| revert   | 代码回退                                                                               |

##### scope

scope 用于指定本次 commit 影响的范围。scope 依据项目而定，例如在业务项目中可以依据菜单或者功能模块划分，如果是组件库开发，则可以依据组件划分。（scope 可省略）

##### subject

subject 是本次 commit 的简洁描述，长度约定在 50 个字符以内，通常遵循以下几个规范：

- 用动词开头，第一人称现在时表述，例如：change 代替 changed 或 changes
- 第一个字母小写
- 结尾不加句号（.）

#### Body

body 是对本次 commit 的详细描述，可以分成多行。（body 可省略）

跟 subject 类似，用动词开头，body 应该说明修改的原因和更改前后的行为对比。

#### Footer

如果本次提交的代码是突破性的变更或关闭缺陷，则 Footer 必需，否则可以省略。

- 突破性的变更

  当前代码与上一个版本有突破性改变，则 Footer 以 BREAKING CHANGE 开头，后面是对变动的描述、以及变动的理由。

- 关闭缺陷

  如果当前提交是针对特定的 issue，那么可以在 Footer 部分填写需要关闭的单个 issue 或一系列 issues。

## 6.集成 Commitizen 实现规范提交

Commitizen 工具来帮助我们自动生成 commit message 格式，从而实现规范提交

> Commitizen 是一个帮助撰写规范 commit message 的工具。它有一个命令行工具 cz-cli。

#### 安装 Commitizen

```
npm install commitizen -g
```

#### 初始化项目

成功安装 Commitizen 后，我们用 **cz-conventional-changelog** 适配器来初始化项目

```
commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact
```

这行命令做了两件事：

- 安装 cz-conventional-changelog 到开发依赖（devDependencies）

- 在

  ```
  package.json
  ```

  中增加了

  ```
  config.commitizen
  ```

  ```json
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
  ```

#### 使用 Commitizen

以前我们提交代码都是 `git commit -m "xxx"`，现在改为 `git cz`，然后按照终端操作提示，逐步填入信息，就能自动生成规范的 commit message。

#### cz-customizable 修改成中文

在项目根目录下创建 `.cz-config.js` 文件，然后按照官方提供的[示例](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fleoforfree%2Fcz-customizable%2Fblob%2Fmaster%2Fcz-config-EXAMPLE.js)来配置。

```json
pnpm install cz-conventional-changelog-zh -D


"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog-zh"
  }
}
```
