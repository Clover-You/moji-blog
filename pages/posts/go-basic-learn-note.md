---
title: Golang 语言基础学习笔记
tags: Golang
lang: zh-CN
date: 2024-04-19 01:20:50
categories: note,golang
pid: 6f604b36-5d8f-4227-ac85-db43927cf53b
last-edit: 2024-04-19 02:03:47
duration: 110min
author: Clover
---
本文主要记录博主 Go 语言的学习过程和结果，参考 [Golang中文学习文档](https://golang.halfiisland.com/essential/std/0.intro.html)，本文不保证内容的原创性

## 准备开始

MacOS(Linux) 通过 [brew](https://brew.sh/) 包管理器安装 golang，安装完后基本就已经可以了

```shell
brew install go
```

博主使用 [VsCode](https://code.visualstudio.com/) 作为开发工具，因为我已经完成 VsCode 个性化配置，故而使用我所熟悉的编辑器，除了 VsCode，也可以使用 [GoLand](https://www.jetbrains.com/go/promo)。以下列表为 VsCode 所依赖的插件，其它内容请查看 [Use](https://www.ctong.top/use)

- [Go](https://marketplace.visualstudio.com/items?itemName=golang.Go) - Golang 官方团队开发的 VsCode 插件

通过快捷键 `Shift + Command + P` 打开命令面板，输入 `> Go: Install/Update Tools`

<img src="/images/go-basic-learn-note-input-install-go-tools-dark.png" class="hidden dark:block" alt=""/>
<img src="/images/go-basic-learn-note-input-install-go-tools-light.png" class="dark:hidden" alt=""/>

选择后会弹出以下面板，选中所有的 go tools 后点击 OK 按钮或者 Enter 键

<img src="/images/go-basic-learn-note-go-tool-list-dark.png" class="hidden dark:block" alt=""/>
<img src="/images/go-basic-learn-note-go-tool-list-light.png" class="dark:hidden" alt=""/>

在安装时可能会因为网络原因导致安装错误，此时我们需要设置代理。

```shell
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.io,direct
```

设置后需要重启 Vs Code 然后重复以上操作安装即可，可能需要一些时间。到此编辑器基本配置完毕可以开始写代码了。

## 指针

### new 和 make

`new` 和 `make` 是内置函数，这两个函数有点类似但是也有不同

```go
func new(Type) *Type
```

- 这个函数的返回值是一个指针类型
- 接收一个"类型"参数
- 用于给指针分配内存空间

```go
func make(t Type, size ...IntegerType) Type
```

- 返回值是一个**值**不是指针
- 接受的第一个参数是一个类型，不定长参数列表根据**传入类型**的不同而不同
- 用于给切片、映射表、通道分配内存

```go
str := new(string) // string 指针
num := new(int32)  // int32 指针
nums := new([]int) // int 切片指针

makeNums := make([]int, 10, 100)    // 创基一个长度为10容量为100的int切片
makeMap := make(map[string]int, 10) // 创建一个容量为 10 的映射表
makeChan := make(chan int, 10)      // 创建一个缓冲区大小为 10 的通道

```
