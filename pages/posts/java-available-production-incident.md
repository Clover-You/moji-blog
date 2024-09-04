---
title: InputStream available 方法出现的生产事故
tags: Java
lang: zh-CN
date: 2024-07-11 16:01:15
categories: java
pid: 57dab8c20e4bc84f5b59ae74ad1ce2900e9e
last-edit: 2024-07-22 18:26:52
duration: 10min
author: Clover
draft: true
---

先说说为什么要使用 `available` 函数: 记得当时在做一个修改的功能, 需要根据用户传递的字段判断要不要修改数据库中对应的字段。为什么不检查如果数据为 `null` 就不更新字段? 这是因为有些数据在前端会被清空，例如下拉框清空后值是 `undefined` 导致保存后无法清空该字段。为了完成这个需求，封装了一个 `getBody` 工具函数来获取 `RequestBody`，检查里面是否存在这个字段，不管它是不是 `null` 。但是一些 Servlet 容器不允许二次读取 `RequestBody` 例如 Tomcat、Jetty。

为了完成需求，我实现了一个可重复读的 `InputStream`。使用 `available` 初始化 `buffer`。这在开发中完全没有任何问题！

因为这在方式比较麻烦, 后来使用零值来更新数据，例如要清空下拉框，那么传个 `0`, 清空字符串就传个空字符 `""` 但是原来写的代码没有及时清除，导致在一年后上线测试偶发 CPU 占用过高的问题。

## 解决

这问题很难找，我一开始以为是登录接口有问题，但是埋点测试发现请求连 `Controller` 都没有进。事大了，没经历过～

最后使用 Java 开发工具 `jstack` 来查调用栈，但是服务器 Java 不带 `jstack` 无奈只能自己下一个 Java 开发版...
而且因为服务器是 Windows Server ，很多命令和 Linux 不一样，找个 线程 ID 都不知道怎么找，最后用微软的 [ProcessExploer](https://learn.microsoft.com/zh-cn/sysinternals/downloads/process-explorer) 工具来找 CPU 占用最高的那个线程，拿到 ID 后因为他是十进制，需要将它转为十六进制，在 Mac/Linux 可以用 `printf "%x\n" pid` 命令来转

<img src="/images/java-available-production-incident/using-position-source-code.webp"/>
