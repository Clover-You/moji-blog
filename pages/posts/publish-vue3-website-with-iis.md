---
title: 使用 IIS 发布 Vue3 网站
date: 2024-07-02 15:15:40
lastEdit: 2024-04-18 15:10:49
lang: zh-CN
tags: Vue
categories: Vue
duration: 8min
pid: 9d804fe304147d4bccb8d13a7515417bf225
author: Clover
---

<!-- Publish a website for Vue3 using IIS. -->
在开始之前需要安装 IIS 服务和安装 requestRouter_amd64.msi rewrite_amd64_zh-CN.msi

- requestRouter_amd64.msi 让 iis 支持 http 代理
  下载地址 [https://www.iis.net/downloads/microsoft/application-request-routing](https://www.iis.net/downloads/microsoft/application-request-routing)
- rewrite_amd64_zh-CN.msi 让 iis 支持 URL 重写
  下载地址 [https://www.iis.net/downloads/microsoft/url-rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)

这两个工具安装完成后需要重启 IIS 管理器。

打包前端代码

```shell
pnpm vite build --mode pro
```

以上命令执行完后，会将打包产物输出到项目根目录 dist 文件夹中。

打开 IIS 在左侧找到 “网站” 右键 “添加网站”。输入网站名和前端 dist 文件夹地址后点确定即可。此时部署的网站已经可以进行预览了。

<img alt="添加网站" src="/images/iis-publish-vue3-website/add-website.png" width="300px" className="dark:invert" />

<img alt="配置网站信息" src="/images/iis-publish-vue3-website/setup-website-info.png" width="400px" className="dark:invert" />

添加完整后，需要开启 IIS server proxy。双击左侧计算机名称，选择右侧 Application Request Reouting Cache

<img alt="打开 AAR" src="/images/iis-publish-vue3-website/open-aar-config-page.png" width="400px" className="dark:invert" />

在右侧找到 Server Proxy Settings 选项打开代理配置页, 将 Enable proxy 选项勾上即可开启 server proxy

<img alt="开启 proxy" src="/images/iis-publish-vue3-website/enable-aar-proxy.png" width="400px" className="dark:invert" />

开启代理服务后，双击部署的网站，在主页中选择 URL 重写

<img alt="重写服务 URL" src="/images/iis-publish-vue3-website/open-url-rewriter.png" width="400px" className="dark:invert" />

## 为什么需要重写 URL？

网站采用前后端分离方式进行开发，在这种方式最终部署在不同端口上，导致网站在发起请求时出现跨域问题，这是浏览器的一种安全策略。

那么为什么在开发时不需要额外配置而打包部署后需要额外配置？这是因为在开发时，已经在 `vite.config.ts` 配置文件中配置了 proxy ,我们约定前端 `/api` 前缀的 URI 都是需要转到服务端，否则视作 Vue Route。只要请求 URI 前缀是 `/api` 那么都需要 vite 服务器对该请求进行代理转发。

而打包之后前端就脱离了 vite 环境，所以需要在部署时额外对请求进行代理。

既然在开发环境可以正常使用网站，为什么还要打包额外部署？

- 更小的包体积：项目往往会采用许多第三方库和插件来增加页面功能，这些库和插件的文件体积可能非常庞大。而打包发布可以将这些库和插件进行合并，减少文件的数量和大小，从而减少页面加载的时间。

- 更好的性能：开发版性能远远不及打包发布后的版本
  1. vite 会按需编译页面而不是全量编译，例如打开页面 A，vite 会将 A.vue 编译为 A.js 返回到浏览器呈现。在这个过程中，如果 A 页面非常复杂那么我们往往会等待非常长的时间才能看到内容。而打包就是将这个行为提前而不需要 vite 缓存造成内存浪费。
  2. vue3 会在打包编译时对代码进行最终优化尽可能的优化代码结构，而开发版无法享受这项功能。
  3. vue 开发时会加载额外调试工具和代码，这些东西在生产环境中完全没有必要，而有些开发调试工具往往需要更高的性能，在 js 单线程环境会增加代码的执行负担，例如：Vue devtools。

点击右侧操作栏 “添加规则” ，在入站规则区域找到 “空白规则” 为后端服务添加反向代理。

<img alt="插件规则" src="/images/iis-publish-vue3-website/add-proxy-rule.png" width="400px" className="dark:invert" />

选择 “通配符” 模式，规则为 `*api/*` 用来匹配前缀为 `/api` 的 URI

在操作选项操作类型选择 “重写” 重写的 URL 为后端服务器的地址。

<img alt="添加 api 服务重写规则" src="/images/iis-publish-vue3-website/add-api-proxy-rule.png" width="400px" className="dark:invert" />

在规则中，假设前端发起 `http://127.0.0.1:8081/api/get_user` 请求，经过 IIS 代理后实际请求为 `http://192.168.2.157:8080/get_user`。

> 这一步一定要勾选 “停止处理后续规则” ，不然就算这个规则匹配上，IIS 还是会往下一个进行匹配。

这一规则添加后，前端就没有什么问题了，但是刷新页面可能会遇到 404。这是因为正常情况下 vue 会劫持浏览器 navigation, 在 vue 中跳转路由时不会访问 IIS 服务。而刷新页面后浏览器会直接访问 IIS，而 IIS 没有这个页面导致的。

要解决这个问题，还需要再添加一条重写规则，也就是无论如何，都将 URL 重写到网站的根路径 `/`

<img alt="添加刷新页面 404 处理规则" src="/images/iis-publish-vue3-website/vue-refresh-4041.png" width="400px" className="dark:invert" />

<img alt="添加刷新页面 404 处理规则" src="/images/iis-publish-vue3-website/vue-refresh-4042.png" width="400px" className="dark:invert" />

> 无论如何，这个规则都应该放在最后
