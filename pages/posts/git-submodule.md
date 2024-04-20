---
title: Git Submodule
author: Clover
date: 2024-04-20 23:35:04
categories: Essay
pid: ca4f9422ec5e384d90fb26a54bcfd1b79b30
last-edit: 2024-04-21 00:14:08
duration: 4min
tags: Git
lang: zh-CN
---

在项目中需要使用到 gRPC，无论是前端还是后端都需要使用同一份 proto 文件。
前端和后端分别存储在不同的仓库，例如 [MojiChat](https://github.com/moji-open-source/MojiChat) 和 MojiChatServer，那么我需要将 proto 文件放在哪个仓库或位置比较好呢？如果将这两个存储库移动到同一个新的存储库中，再将 proto 文件放到这个存储库中那么就实现可以前后端公用一个 proto 文件。

这操作比较危险，而且如果有其它项目需要用到这个 proto 文件就得加入这个存储库，不太理想。

干脆直接创建一个存储库专门存储这个 proto 文件，例如：[moji-chat-proto](https://github.com/moji-open-source/moji-chat-proto)
如果需要使用这个 proto 直接 clone 这个存储库即可。通过 Git Submodule 可以完美解决我们这个问题！

通过 `git submodule add` 命令添加目标仓库(url 是目标地址 例如 ssh)

```shell
git submodule add <url> <target_path>
```

- `<url>` - 是存储库地址
- `<target_path>` - 是这个存储库在目标项目的存放地址

此时会在项目 root path 中添加 `.gitmodules` 文件，其内容为

```txt
[submodule "src-tauri/src/protos"]
  path = src-tauri/src/protos
  url = git@github.com:moji-open-source/moji-chat-proto.git
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
