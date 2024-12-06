---
title: 'Reasons to Avoid Arrow Function Overuse: Why Traditional Functions Are Still Indispensable'
date: 2024-09-29 00:18
lang: en
duration: 8min
pid: 969d363d8f19cf40953b05b420bdfc5d7813
categories: Essay
lastEdit: 2024-10-09 14:57:33
---
[[toc]]

> [原文](/posts/why-not-arrow-functions)

Throughout the evolution of JavaScript, the way we define functions has undergone numerous transformations. Particularly since ES6 introduced arrow functions, many developers have leaned toward using them to replace traditional `function` declarations. However, while arrow functions do offer certain conveniences, I believe there are scenarios where we shouldn’t rely on them excessively. This article delves into why I don’t recommend completely replacing traditional functions.

## The `this` Keyword Dilemma in JavaScript

In JavaScript, the dynamic binding of the `this` keyword has always been a perplexing issue. With traditional `function` declarations, `this` might point to unexpected objects in different contexts, prompting developers to use `bind` to ensure `this` refers to the right context.

```js
function todo() {
  console.log(this)
}
const myTodo = todo.bind('hello world')
myTodo() // Output: hello world
```

> In this example, the `bind` method ensures that `this` points to "hello world".

There are even tricks like storing `this` in a variable to work around this issue:

```js
const _this = this
function todo() {
  console.log(_this)
}
```

Although these solutions somewhat address the problem, they lack elegance. Things only improved when ES6 introduced arrow functions.

Because arrow functions handle `this` in a simpler way, developers have started using them almost exclusively, particularly in front-end frameworks like Vue and React.

## Why I Don’t Recommend Overusing Arrow Functions

Although arrow functions solve the `this` problem and offer more concise syntax, I still don’t recommend using them in every scenario.

### Naming and Readability

Arrow functions are anonymous by nature. Unlike `function` declarations, you can’t directly name them. Instead, they must be used through variable declarations. When our codebase is filled with variables interspersed with arrow functions, it becomes challenging to identify which is which. This can lead to longer time spent searching for specific functions, especially when function names are ambiguous.

<img src="/images/why-not-arrow-functions-dark.png" class="hidden dark:block" alt="" />
<img src="/images/why-not-arrow-functions-light.png" class="dark:hidden" alt=""/>

Using the `function` keyword, developers can instantly recognize that they are dealing with a function rather than just a variable. IDEs also often display these differently. For instance, in VSCode, functions and variables are shown with distinct icons, enhancing readability—a really neat feature!

<img src="/images/why-not-arrow-functions-tradition-dark.png" class="hidden dark:block" alt="" />
<img src="/images/why-not-arrow-functions-tradition-light.png" class="dark:hidden" alt=""/>

### Appropriate Use Cases

Arrow functions are great for callback scenarios, or wherever callbacks are frequently used. This is because `this` issues typically arise in **callbacks**, and in these cases, we usually don’t care about the intricate details of the function’s context. Using arrow functions here keeps the code cleaner and more concise.

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

In the above code, the `format` method of the `User` class uses an arrow function to ensure `this` correctly refers to the `User` instance rather than the `Collection` class. Otherwise, the `this` in the `forEach` method would no longer point to `User`, causing the `formatUserName` method to fail.

Besides callbacks, you might also consider using arrow functions within a function declaration itself:

```ts
function test() {
  const format = () => 'prefix'
  format()
}
```

## Conclusion

Although arrow functions can resolve `this` binding issues and offer a more streamlined syntax in certain contexts, traditional `function` declarations still possess unique strengths in many situations. As developers, we should adapt our choice of function declaration based on the specific needs of the project, maintaining the readability and maintainability of our code rather than blindly following trends.
