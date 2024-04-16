# Markdown handle

- Start Date: 2024-04-15 17:48:41
- RFC PR:

## Summary

Use TOML files as configuration files because they are overall more concise. In JavaScript, can use the TOML library for parsing.

## Motivation

Because this project may not be used by just one person, and each user's content is unlikely to be the same, without configurability, users will find it difficult to maintain and utilize the latest code.

Taking menus as an example, my own blog may have menu items related to MojiBlog, but other users may not need this menu item, so they would need to remove it from the source code. If the project source code gets updated, users would have to deal with conflicts every time they update, which is quite impractical in the 21st century.

With project configurability, users don't need to worry about what's happening in the source code; they only need to maintain their configuration files.

因为这个项目可能不是只有一个人用，并且每个人的内容都不可能相同，如果不配置化，那么使用者将难以维护和使用最新的代码。

通过菜单进行举例，我自己的博客可能存在 MojiBlog 相关的菜单项，其他使用者并不需要这个菜单项那么需要在源码中进行删除。如果项目源码进行升级，那么使用者每次更新时都需要去处理冲突信息，在21世纪的今天，这是非常愚蠢的做法。

项目配置化后，使用者并不需要理会源码中发生了什么，只需要维护自己的配置文件即可。

## Detailed design

配置文件命名为 `_config.toml`

```toml
[website]
# 网站标题
title = "Clover's Blog"
# 副标题
subtitle = "subtitle"
# 网站描述
description = "Hey, I am Clover You, welcome here!"
# 网站关键字
keywords = [
  "blog",
  "develop"
]
# 博客作者名称
author = "Clover You"
# 部署后网站地址
domain = "https://www.ctong.top"
# 左上角 logo 图片
logo = "/logo.webp"
# 左上角 logo 文字
logoText = "CLOVER"
# 底部版权文案信息
copyright = "CC BY-NC-SA 4.02024-PRESENT © Clover You"

[theme]
# 默认主题模式
mode = "light"

[navbar]
items = [
  { url = "/about", label = "About" },
  { url = "/", label = "Blog" },
  { url = "https://github.com/Clover-You", iconClass = "icon-[mdi--github]", target = "_blank" },
]
```

# Drawbacks

Why should we *not* do this? Please consider:

- implementation cost, both in term of code size and complexity
- whether the proposed feature can be implemented in user space
- the impact on teaching people React
- integration of this feature with other existing and planned features
- cost of migrating existing React applications (is it a breaking change?)

There are tradeoffs to choosing any path. Attempt to identify them here.

# Alternatives

What other designs have been considered? What is the impact of not doing this?

# Adoption strategy

If we implement this proposal, how will existing React developers adopt it? Is
this a breaking change? Can we write a codemod? Should we coordinate with
other projects or libraries?

# How we teach this

What names and terminology work best for these concepts and why? How is this
idea best presented? As a continuation of existing React patterns?

Would the acceptance of this proposal mean the React documentation must be
re-organized or altered? Does it change how React is taught to new developers
at any level?

How should this feature be taught to existing React developers?

# Unresolved questions

Optional, but suggested for first drafts. What parts of the design are still
TBD?
