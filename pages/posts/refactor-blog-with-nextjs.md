---
title: 使用 NextJS 重构我的博客
autor: Clover
date: 2024-04-16 15:09:50
lang: zh-CN
categories: essay
pid: d9f25325-0e89-4ff9-b97d-6121b8509b8a
last-edit: 2024-04-16 15:12:44
duration: 10min
---
> 编辑中

我使用过 Hexo、WordPress、CSDN、掘金、简书等平台管理我的博客内容，它们很好用。有人可能会问：既然好用为什么你还要自己从 0 开始搭建博客呢？

嗯这个问题怎么说呢！其实我从一九年的时候就想自建一个个人博客，但是由于某种原因，迟迟没有行动，绝对不是因为懒！！
我使用这些平台的时候，总感觉好像缺了点什么？一开始使用的是 CSDN 但是每次使用 CSDN 时无论是查资料还是写文，体验总是很糟糕（广告太多了点）

后来我转到有道和印象笔记，有道我记得没会员不能粘贴图片而且操作比较卡顿。后来我换到了印象笔记，非常棒，他能够满足我的某些要求，例如写了文章后我喜欢分享出去还能看到有多少人看我的水文，哇太酷啦！

> 这两家我都开过年会

后来通过 <a href="https://b23.tv/9hASjFy" target="_blank">@程序羊</a> 了解到了<a href="https://github.com/hexojs/hexo" target="_blank" class="markdown-magic-link"><span class="markdown-magic-link-image" style="background-image: url(https://hexo.io/logo.svg)"></span>Hexo</a>。体验下来挺好，可以直接通过 GitHub Page 部署，但是感觉静态博客好像不能满足我当时的需求。
于是了解到了 WordPress , 嗯很棒，支持 SSR、使用 MySQL 数据库还可以部署在自己的服务器，太完美了。使用了大概半年左右就出现了钱包焦虑，这服务器也越来越贵了而且我好像用不上服务器。兜兜转转又回到了 Hexo...

后来了解到 [@苏卡卡](https://blog.skk.moe/) 大佬，他使用 NextJS + Hexo 重构了他的博客 [React Server Component 初体验与实践 —— 将博客迁移到 Next.js App Router](https://blog.skk.moe/post/refactor-my-blog-using-nextjs-app-router/)! 原来还能这样玩，很快啊，我啪的一下就创建了 NextJS 项目。

## 我为什么移除 Hexo

上文了解到我在博客中引入了 Hexo 对博文进行管理，但是我为什么又要移除它?

1. NextJS + Hexo@7 在启动时发生错误，后面花了一段时间解决掉了这不是主要原因但是是移除时的考虑因素
2. Hexo 插件是 CommonJS 规范，使用 ESM 规范的依赖时会非常麻烦。它默认支持 `highlight.js` 和 `prismjs` 来对代码进行高亮。但是这两个都不是很好，rust 有些代码它们识别错误导致观感看上去不是很好！后来我引入了 Shiki 对代码进行高亮，但是 Shiki 高版本是 ESM 规范，当然，可以通过 CJS 使用，问题是在 Hexo Plugin 系统不支持动态倒入或者 `import` 所以在集成时需要额外处理这个问题，困扰了我许久但还是解决了。
3. Hexo 文档感觉不全，反正我是找不到

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
