---
title: Safari 剪切板写入的难题
date: 2024-10-29 15:52:33
lang: zh-CN
duration: 8min
pid: 072fd0434441a848c368fef1d07fb1ae3a2f
tags: TS
categories: TypeScript
lastEdit: 2024-10-29 15:53:15
draft: false
---
[[toc]]

自从玩了原神之后，我会在米游社刷一些帖子，我发现他们的表情包很有趣但是遗憾的是不能直接在外部使用。 我希望能够在其它社交平台使用他们的表情包，所以，最近做了一个项目 [MiHoYo Sticker](https://mhy-sticker.ctong.top/)。他的功能很简单，点击表情包后会将图片写入剪切板中。这就利用到了系统剪切板 API `navigator.clipboard.write()`。

在很早之前，随着Web应用程序越来越复杂，浏览器开始实施更严格的安全策略，以防止网页滥用用户权限。为了保护用户的隐私和安全，确保敏感操作需要用户的明确同意。这个特性在现代浏览器中逐渐得到加强。在 2018 年左右，对于剪贴板的访问和其他敏感 API 的调用，浏览器开始引入更严格的安全限制，通常要求在事件处理函数内调用这些 API e.g.

```tsx
function App() {
  function onCopyHandler() {
    navigator.clipboard.write('hello world')
  }

  return (
    <Button onClick={onCopyHandler}>Copy</Button>
  )
}
```

以上代码工作的很好，哪怕是在 Safari。但是，我需要复制图片呢？在 Safari 这就变得非常糟糕，复制图片我们通常需要将图片转为 `Blob` 后写入剪切板中。

```tsx
function writeBlob(blob: Blob, type: string = blob.type) {
  const data = [new ClipboardItem({ [type]: blob })]
  return navigator.clipboard.write(data)
}

async function onCopy(event: MouseEvent<HTMLImageElement>, sticker: Sticker) {
  const img = event.currentTarget

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const ctx = canvas.getContext('2d')
  ctx?.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)

  canvas.toBlob(async (blob) => {
    try {
      if (!blob)
        return
      await writeBlob(blob)

      toast(`You copied 「${sticker.name}」`, {
        position: 'top-right',
        icon: <BellIcon />,
      })
    }
    catch (e) {
      console.error(e)
    }
  }, 'image/png')
}
```

这段代码在 Google Chrome 中一切正常，在 Safari 中却出现了这样的错误

<div class="p-2 border-red-500 border-1 rounded-xl text-red-500 bg-red-500/10 mb-4">
  The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.
</div>

起初我以为是我的操作系统禁止了 Safari 剪切板的读写行为，但是我找不到这个权限应该在哪里设置。我查看了 <a href="https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1" target="_blank">WebKit</a> ，可是这一切看起来都很好。在我的尝试过程中，我发现 Safari `clipboard.write` 不能在事件处理函数中间接调用。例如上面的代码是 toBlob - invoke -> write ，这不被允许。而 Chrome 在用户点击后整个调用栈都能使用。

知道问题后，我需要自己实现 canvas to blob 以确保 `write` 执行之前的代码都是同步的。

```ts
function toBlob(canvas: HTMLCanvasElement) {
  const dataURL = canvas.toDataURL()

  const byteString = atob(dataURL.split(',')[1])
  const mimeString = dataURL.match(/^data:([^;]+);base64,/)?.[1]

  const buffer = new ArrayBuffer(byteString.length)
  const intArray = new Uint8Array(buffer)

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }

  return new Blob([intArray.buffer], { type: mimeString })
}
```

以上代码使用 `toDataURL` 将 canvas 转为 url，大概长这样 `data:image/png;base64,...` 。再通过 `atob` 函数将 Base64 转为原始的二进制字符串。`charCodeAt` 获取每一个二进制字符串的字节码。最后将这些字节码转为 `Blob`。

我不知道它和 canvas 提供的 toBlob 对比效率如何，但是起码它好用 (:

```ts
async function onCopy(event: React.MouseEvent<HTMLImageElement>, sticker: Sticker) {
  const img = event.currentTarget

  const canvas = imgToConvas(img)
  if (!canvas)
    return

  const blob = toBlob(canvas)
  if (!blob)
    return

  const clipboardItem = [new ClipboardItem({ [blob.type]: blob })]
  await navigator.clipboard.write(clipboardItem)
}
```

在使用我封装的 `toBlob` 后，一切都顺利进行

最后，

很感谢你看到这里，亲爱的朋友！

欢迎大家使用我的项目 [MiHoYo Sticker](https://mhy-sticker.ctong.top/)

同样的，它也被开源在了 [GitHub](https://github.com/Clover-You/mihoyo-sticker)
