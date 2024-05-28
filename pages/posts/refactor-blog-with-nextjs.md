---
title: 使用 NextJS 重构我的博客
autor: Clover
date: 2024-04-16 15:09:50
lang: zh-CN
categories: Essay
pid: d9f25325-0e89-4ff9-b97d-6121b8509b8a
last-edit: 2024-05-28 11:47:41
duration: 10min
---
> 编辑中

我曾使用过 Hexo、WordPress、CSDN、掘金、简书等平台来管理我的博客内容，它们都很好用。有人可能会问：既然这么好用，为什么还要自己从零开始搭建博客呢？

这个问题其实有点复杂。从 2019 年起，我就想自建一个个人博客，但由于种种原因，迟迟没有付诸行动。绝对不是因为懒！！绝对不是！！

在使用这些平台时，总感觉好像缺了点什么。最初使用的是 CSDN，但每次使用时，无论是查资料还是写文章，体验都很糟糕（广告太多了）。后来我转到了有道云笔记和印象笔记。记得有道云笔记在没有会员的情况下无法粘贴图片上传图片，只能手动选择上传，而且操作比较卡顿。再后来我换到了印象笔记，它非常棒，满足了我的一些需求，例如可以在写完文章后分享出去，还能看到有多少人阅读我的文章，这太酷辣～

> 这两家我都开过年会

后来通过 <a href="https://b23.tv/9hASjFy" target="_blank">@程序羊</a> 了解到了<a href="https://github.com/hexojs/hexo" target="_blank" class="markdown-magic-link"><span class="markdown-magic-link-image" style="background-image: url(https://hexo.io/logo.svg)"></span>Hexo</a>。体验下来挺好，可以直接通过 GitHub Page 部署，但是感觉静态博客好像不能满足我当时的需求。
于是了解到了 WordPress , 嗯很棒，支持 SSR、使用 MySQL 数据库还可以部署在自己的服务器，太完美了。使用了大概半年左右就出现了钱包焦虑，这服务器也越来越贵了而且我好像用不上服务器。兜兜转转又回到了 Hexo...

后来了解到 [@苏卡卡](https://blog.skk.moe/) 大佬，他使用 NextJS + Hexo 重构了他的博客 [React Server Component 初体验与实践 —— 将博客迁移到 Next.js App Router](https://blog.skk.moe/post/refactor-my-blog-using-nextjs-app-router/)! 原来还能这样玩，很快啊，我啪的一下就创建了 NextJS 项目，不出意外的话，你现在真正使用它阅读这篇文章。

## 我为什么移除 Hexo

虽然我曾在博客中使用 Hexo 管理博文，但最终决定移除它。原因如下：

1. NextJS + Hexo@7 在启动时发生错误，虽然我花了一段时间解决了这个问题，但这成为我考虑移除 Hexo 的因素之一。
2. Hexo 插件采用 CommonJS 规范，使用 ESM 规范的依赖时非常麻烦。它默认支持 highlight.js 和 prismjs 来进行代码高亮，但这两个工具在处理某些代码（如 Rust 代码）时效果不佳。后来我引入了 Shiki 来进行代码高亮，但 Shiki 的高版本是 ESM 规范，尽管可以通过 CJS 使用，但在 Hexo 插件系统中不支持动态导入或 import，因此需要额外处理，困扰了我很久。
3. Hexo 文档不够完整，很多时候我找不到需要的信息。

我项目中基本都是 TS 文件，就有那么几粒老鼠屎看着就不爽所以我直接将 Hexo 移除自己管理博文信息。

说一下 NextJS + Hexo 出现错误的解决办法吧，在`next.config.js` 中添加以下配置即可

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['hexo', 'hexo-fs', 'hexo-util']
  },
}

export default nextConfig
```
