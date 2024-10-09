---
title: 避免箭头函数滥用的原因：为何传统函数依然不可或缺
date: 2024-09-29 00:18
lang: zh-CN
duration: 6min
pid: 7ba47d7da08d054754296bd9135f5599cac5
categories: Essay
lastEdit: 2024-10-09 14:54:19
---
[[toc]]

> [English Version](/posts/why-not-arrow-functions-en) ｜ Translation from Chat GPT

在 JavaScript 的发展过程中，函数的定义方式经历了多次变革。尤其是 ES6 引入的箭头函数，使得许多开发者倾向于使用它来替代传统的 `function` 声明。然而，尽管箭头函数提供了一些便利，但我认为在某些情况下不应过度依赖它。本文将探讨我不推荐替代传统函数的理由。

在 JavaScript 中，`this` 关键字的动态绑定一直是一个复杂的问题。传统的 `function` 声明在不同上下文中可能会导致 this 指向意想不到的对象，因此开发者往往需要使用 `bind` 来确保 this 指向正确的上下文。

```js
function todo() {
  console.log(this);
}
const myTodo = todo.bind("hello world");
myTodo(); // 输出: hello world
```

> 在这个示例中，`bind` 方法确保 `this` 指向了“hello world”。

甚至是通过一些魔法来处理 `this` 的问题，例如：

```js
const _this = this;
function todo() {
  console.log(_this);
}
```

虽然这些解决方案在某种程度上解决了问题，但使用起来却不够优雅。直到 ES6 引入箭头函数，情况才有所改善。

由于 `this` 问题和它的简单，人们往往都使用它来定义函数而不再使用 `function`，这在 Vue 、React 等前端框架中尤为常见。

## 不推荐的理由

虽然箭头函数解决了 `this` 问题并且书写更为简单，但我却不推荐在所有场景中使用它们。

### 命名和可读性

箭头函数是一种匿名函数，你无法像 `function` 一样为他命名，只能通过变量声明的方式进行使用。当我们代码中有大量变量且混入箭头函数时，人们往往很难对其进行鉴别。这可能导致在编码时花费更多时间去寻找所需的函数，尤其当函数命名含糊时，更是如此。

<img src="/images/why-not-arrow-functions-dark.png" class="hidden dark:block" alt="" />
<img src="/images/why-not-arrow-functions-light.png" class="dark:hidden" alt=""/>

使用 `function` 声明函数，开发者马上就知道这是一个函数而不是什么变量。并且我们的 IDE 也会给出不同的展现形式如在 VSCode 中，通过展现不同的图标进行区分，增强可读性。这看起来很棒！

<img src="/images/why-not-arrow-functions-tradition-dark.png" class="hidden dark:block" alt="" />
<img src="/images/why-not-arrow-functions-tradition-light.png" class="dark:hidden" alt=""/>

### 适用场景

我们可以在回调函数或尽可能在回调函数中使用箭头函数。因为 `this` 问题往往都是发生在**回调函数**中，且在这些情况下，我们不需要关心该函数的具体细节。这使得代码更简洁。

```ts
class Collection<T = any> {
  forEach(list: T[], callback: (item: T) => void) {
    list.forEach(callback)
  }
}

const collection = new Collection()

class User {
  public userName: string

  formatUserName() {
    return `prefix-${this.userName}`
  }
  
  format() {
    collection.forEach([1, 2, 3], () => {
      this.formatUserName()
    })
  }
}
```

在以上代码中，`class User#format` 方法使用箭头函数来确保`this` 指向 `User` 实例，而不是 `Collection` 类。否则，`forEach` 方法中的 `this` 将不再指向 `User`，导致无法正确调用 `formatUserName` 方法。

除了回调函数，在函数内部声明中也可以考虑使用箭头函数，例如：

```ts
function test() {
 const format = () => 'prefix'
 format()
}
```

---

尽管箭头函数在某些情况下能够解决 `this` 指向问题，并且语法更为简洁，但在很多情况下，传统的 `function` 声明仍然具备其独特的优势。我们开发者应根据具体需求灵活选择函数定义方式，确保代码的可读性和维护性，而不是盲目追随趋势。
