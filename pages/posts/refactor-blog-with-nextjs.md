---
title: 使用 NextJS 重构我的博客
autor: Clover
date: 2024-04-16 15:09:50
lang: zh-CN
categories: Essay
pid: 610cce36f148474b7ccb3eacabfb8b9bb18b
last-edit: 2024-08-28 15:39:01
duration: 18min
imports: |
  import { DialogDemo } from '#/components/demo/DialogDemo'
  import { GitHubTooltipAnchor } from '#/components/GitHubTooltip'
---

> 如果你对这个博客感兴趣，欢迎访问我的 [GitHub](https://github.com/moji-open-source/moji-blog) 仓库。它是开源的，你可以查看代码并进行贡献！

作为一名程序员，我对技术博客一直抱有极大的热情。从最早的 CSDN、博客园和简书，到后来尝试的有道云笔记和印象笔记，再到后来发现的 Hexo 和 WordPress，我的博客之旅经历了多次选择和改变。

我的博客之旅从 CSDN、博客园和简书开始，这些平台都很容易上手，但也都有各自的问题，最终让我感到失望。于是，我转向了 **有道云笔记** 和 **印象笔记**。

**有道云笔记** 虽然简单易用，但在处理图片时却很麻烦。复制粘贴上传图片需要会员权限，并且编辑长篇文章非常卡顿，应该是千来字左右？总之它不能满足我的需求。

相比之下，**印象笔记** 满足了我很多要求，比如可以轻松分享文章并查看阅读量，这让我觉得非常酷。然而，具体什么原因让我最终放弃它，我已经记不清了。

> 这两款产品，我都开过会员，但是为了一个简单的功能去支付昂贵的费用，这不合理

### 初识 Hexo 和 WordPress

后来，我通过 <GitHubTooltipAnchor href="https://b23.tv/9hASjFy" user="hansonwang99">@CodeSheep</GitHubTooltipAnchor> 了解到了 [Hexo](https://github.com/hexojs/hexo)。最初的体验非常好，它允许我将博客直接部署到 GitHub Pages 上，过程简单快捷。尽管如此，随着需求的变化，我逐渐感受到静态博客的限制，尤其是第三方评论组件加载速度特别慢。

于是，我尝试了 **WordPress**，它支持服务端渲染（SSR）、使用 MySQL 数据库，并且可以部署在自己的服务器上。当时，我觉得这太完美了！然而，随着时间的推移，我意识到这对学生来说过于昂贵，最终还是回到了 Hexo。

### 转向 Next.js：拥抱新技术

偶然间，我读到 <GitHubTooltipAnchor href="https://blog.skk.moe/" user="sukkaw">@苏卡卡</GitHubTooltipAnchor> 的一篇文章，他用 **Next.js + Hexo Core** 重构了他的博客 [《React Server Component 初体验与实践 —— 将博客迁移到 Next.js App Router》](https://blog.skk.moe/post/refactor-my-blog-using-nextjs-app-router/)。这给了我极大的启发，于是我也开始探索 **Next.js** 的可能性。

我选择 **Next.js** 是因为我比较钟情于 **React**，而 Next.js 提供了一些非常出色的特性，比如服务端渲染（SSR）、静态网站生成（SSG）和增量静态生成（ISR），这些功能使得网站更易于扩展和优化。此外，Next.js 还拥有内置的路由系统、支持 TypeScript 和全局 CSS，以及高效的数据获取机制（如 `generateStaticParams` 和 `generateMetadata`），这些都为我提供了灵活性和强大的开发体验。

### Next.js + Hexo 的挑战与放弃的原因

在使用 **Next.js + Hexo** 的过程中，我遇到了许多挑战，最终让我决定放弃 Hexo。

首先，Hexo 采用 **CommonJS** 规范，而我需要使用 **Shiki** 这样的语法高亮引擎，它使用 ESM 规范。Shiki 是一款美观且功能强大的语法高亮工具，支持几乎所有主流编程语言的精确高亮显示。但在 Hexo 插件系统中，无法使用动态导入或 `import` 语句，这使得我不得不花费额外的精力来处理这个问题。

此外，在 **Next.js + Hexo@7** 环境下启动时，出现了错误问题。

为了解决这个问题，我需要在 `next.config.js` 中添加以下配置：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['hexo', 'hexo-fs', 'hexo-util']
  },
}

export default nextConfig
```

尽管这些问题我最终都解决了，但过程非常耗时且复杂。

并且，**Hexo 的 API 文档过于简单**，很多时候找不到需要的信息。同时，我的项目文件大多是用 TypeScript 编写的，为了兼容 Hexo，我不得不创建一些不必要的文件，这让我感到非常困扰。这些额外的工作让我逐渐失去了耐心，它们是妥协的产物，久而久而我不想再将就。

### 渲染 Markdown

在重构我的博客时，我决定将文章和页面内容通过 Markdown 文件进行渲染。为此，我设计了如下的项目目录结构：

```text
:- pages
   - posts
     - post.md
 - src
   - app
```

为了在 Next.js 中处理 Markdown 文件，我编写了 `unplugin-react-markdown` 插件。这个插件允许你在普通的 Markdown 文件中直接引入和使用 React 组件，从而让文章更加“生动”。

这里有个示例，点击它会有好事发生

<DialogDemo /><br/>

它的核心原理是使用 `markdown-it` 将 Markdown 解析为 HTML，然后通过 `jsxify-html` 将普通 HTML 转换为 JSX。最后，这个插件会将 JSX 与 Markdown 元数据中的 `imports` 结合，生成一个完整的 React 组件。

在 `next.config.mjs` 文件中添加即可：

```js
// next.config.mjs
import Markdown from 'unplugin-react-markdown/webpack'
import Shiki from '@shikijs/markdown-it'

function parseMetaString(_metaString, _code, lang) {
  return {
    dataLanguage: lang,
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: (config) => {
    // 将 unplugin-react-markdown 注册到 webpack
    config.plugins.push(Markdown({
      // 配置 markdown-it 插件
      markdownItSetup: async (md) => {
        md.use(await Shiki({
          themes: {
            light: 'vitesse-light',
            dark: 'nord',
          },
          theme: {
            colorReplacements: {
              '#2e3440ff': '#282a2d',
            },
          },
          parseMetaString,
        }))
      },
    }))
    return config
  },
}

export default nextConfig
```

### 动态加载数据：在 Next.js 中渲染文章

在 Next.js 中，我们不必为每篇文章单独创建一个页面，可以利用 动态路由（Dynamic Routes） 来实现。

动态路由部分可以通过使用方括号包裹文件夹名称来创建，例如 `[slug]` 或 `[userName]`。这些动态部分将作为参数 `prop` 传递给 `layout`、`page`、`route` 以及 `generateMetadata` 等函数。

因此，我无需手动获取所有文章的信息，只需通过动态路由中的 `slug` 参数来导入相应的 Markdown 文件即可。

```tsx
// src/app/posts/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fg from 'fast-glob'
import fs from 'fs-extra'
import toml from 'toml'

import dayjs from 'dayjs'
import { getPostBySlug, getSlugs } from '#/core/post'
import { PostView } from '#/components/post-view'
import { Goback } from '#/components/goback'
import { appendStrPrefix } from '#/article'

interface Props {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  try {
    return await import(`#/../pages/posts/${slug}.md`)
  }
  catch (err) {
    console.error(err)
    return undefined
  }
}

export default async function PostPage(props: Props) {
  // 在这里动态导入 markdown 文件，实际导出的是一个 React 组件，这是 unplugin-react-markdown 插件为我们做的
  const postModule = await getPost(props.params.slug)

  if (!postModule)
    return notFound()

  // frontmatter 是 markdown 的元数据
  const { default: MarkdownView, frontmatter } = postModule

  function getLocaleString(date: Date | string, lang: string) {
    return dayjs(date).toDate().toLocaleString(lang, { dateStyle: 'medium' })
  }

  return (
    <div className="mx-auto container">
      <div className="prose mb-8">
        <h1>{frontmatter.title}</h1>
        <p className="opacity-50">
          {getLocaleString(frontmatter.date, 'en')}
          <span>
            {appendStrPrefix(frontmatter.duration, ' · ')}
          </span>
        </p>
      </div>

      <MarkdownView />
    </div>
  )
}
```

### Markdown 文件示例

创建 `pages/posts/rust.md` 文件，启动项目后访问 `http://127.0.0.1:3000/posts/rust` 就可以看见以下文章。

`imports` 是 `unplugin-react-markdown` 插件的一个保留关键字，用于在 Markdown 中引入 React 组件进行使用

```md
---
title: Post title
author: Clover You
imports: |
  import Hello from '@/components/Hello'
---

<Hello />

Hello World
```

### 结语

我的博客之旅从 CSDN 开始，最终选择了 Next.js。这一路充满了探索和挑战，但也让我学到了很多。每一个转变的决定背后都有一个故事，而我仍然在这条路上不断探索，努力让我的博客变得更加出色。最后，感谢你能够看到这！
