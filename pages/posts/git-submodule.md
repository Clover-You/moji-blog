---
title: Git Submodule
author: Clover
date: 2024-04-20 23:35:04
categories: Essay
pid: ca4f9422ec5e384d90fb26a54bcfd1b79b30
last-edit: 2024-04-20 23:45:06
duration: 4min
tags: Git
lang: zh-CN
---

通过 `git submodule add` 命令添加目标仓库(url 是目标地址 例如 ssh)

```shell
git submodule add <url> <source_path>
```

此时会在项目 root path 中添加 `.gitmodules` 文件，其内容为

```txt
[submodule "<source_path>"]
 path = <source_path>
 url = <url>
```

最后将其 `push` 到仓库即可，它不会将 git submodule 中的源码提交。

如果你 clone 一个存在 git submodule 的仓库，那么通过 `git pull` 命令只能克隆该项目本身而无法克隆其子模块。

如果需要克隆当前项目及其所有子模块，那么可以添加 `--recursive` 参数

```shell
git clone --recursive <url>
```

或者 `git pull --recurse-submodules` 拉取所有子模块

如果只是需要更新子模块，那么执行这个命令即可

````shell
# git 1.8.2 及以上版本
git submodule update --recursive --remote
# git 1.7.3 及以上版本
git submodule update --recursive
```
