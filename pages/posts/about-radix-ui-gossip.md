---
title: 关于 Headless UI 的一些闲言碎语
date: 2024-06-14 17:36:35
lang: zh-CN
duration: 10min
pid: 19dd997fc7bec54d1c68ba2d4b66dd77a29c
tags: Gossip
categories: Gossip
lastEdit: 2024-06-14 17:59:51
---

前端有个 Headless UI 叫 RadixUI ,设计挺好看的目前在用。但我个人感觉不是很好，因为它需要自己手动维护源码，这意味着如果官方更新UI后你不能够以便捷的方式去更新这些代码无法享受新功能。这种形式对于一些需要客制化的项目而言，确实很不错。

如果我们不需要从源码下手就能够更方便的客制化，会不会更好一些？如果将组件每个部件都拆分出来作为一个独立的组件并且这些组件都支持自定义渲染是不是就可以了？

```tsx
function CardFooter({ renderer }) {
  if (renderer)
    return renderer()
  return <>Footer</>
}

function CardHead({ renderer }) {
  if (renderer)
    return renderer()
  return <>Head</>
}

function Card({ children }) {
  return (
    <div>{children}</div>
  )
}
```

类似这种方式，如果没有指定渲染器那么采用默认样式，如果有 renderer 那么就把所有 API 传过去 emmm... :)

好像有点类似 [NextUI](https://nextui.org/) :)

这些 UI 库都太过简单了，功能没有 Antd 丰富, 但是 Antd 客制化支持又很一般！我相信在 UI 这方面，鱼和熊掌，一定可以兼得！
