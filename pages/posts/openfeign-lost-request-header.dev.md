---
title: OpenFeign 远程调用丢失请求头
author: Clover
date: 2024-04-07 21:45:09
lang: zh-CN
tags: java,
categories: NOTES
pid: 67890-877324
---

在业务中，需要使用A、B两个模块，这些模块使用了SpringSession共享Session数据。在B模块中的业务需要用户登录后才能操作。当A调用B的业务时，在B模块中获取不到用户的Session信息，导致B模块判定该请求用户没有登录导致A模块拿不到所需数据。问题是A模块可以拿到该用户的登录信息并且，已经使用了SpringSession进行共享Session数据。

## 找出问题原因

使用Feign发送远程调用

![发送远程请求](https://qiniu-note-image.ctong.top/note/images/202202252024388.png)

当请求进到B服务时被其登录验证拦截器拦截，试图去Session中拿登录信息时，结果为 `null`（已确定登录）

![B服务检查登录拦截器](https://qiniu-note-image.ctong.top/note/images/202202252024925.png)

我们都知道，session的原理是需要通过 cookie 中的某个值(jesessionid)来确定一个Session对象，在B模块中拿不到用户数据是因为无法通过指定cookie来获取这个到Session对象。

为了解决这个问题，需要Debug一下Feign的流程。

## Feign 流程

查询发送请求，来到远程调用代码打断点，setup into 进去检查

![1](/Users/clover/Library/Application Support/typora-user-images/截屏2022-02-25 下午8.27.51.png)

在判断不是`equals、hashCode、toString`等方法时，执行 `invoke`方法进行远程调用，setup into进入

![进入invoke方法](https://qiniu-note-image.ctong.top/note/images/202202252030829.png)

在`invoke`方法中，首先去创建一个**新**的请求模板，这个模板包含了我们的请求头等请求信息

![创建request请求模板](https://qiniu-note-image.ctong.top/note/images/202202252032189.png)

并没有其它特殊处理就直接调用 `Client` 发送请求了
![请求发送](https://qiniu-note-image.ctong.top/note/images/202202252037539.png)

从 feign 的流程看出，它是直接给我门创建一个新的请求，并没有给我们封装浏览器给A服务发送请求时携带的请求头等信息。

## 解析

在debug过程中，发现 `executeAndDecode` 方法中在调用 `Client` 发送请求时有一个 `this.targetRequest(template);` 操作，它返回一个 `Request` ，`Client` 发送请求时代的就是这个request对象。

![Request](https://qiniu-note-image.ctong.top/note/images/202202252043801.png)

在 `targetRequest` 方法中发现，他会拿到一个什么拦截器 `requestInterceptors`，然后便利调用它的 `apply` 方法并把它创建的请求模板传过去 `RequestTemplate` ，而这个 `RequestInterceptors` 是在容器中拿的，所以我们只需要在容器中添加一个 `RequestInterceptors` 组件即可。

![targetRequest内部](https://qiniu-note-image.ctong.top/note/images/202202252045067.png)

例如：

```java
@Component
public class FeignFillContent implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate requestTemplate) {
        // 同步cookie
        requestTemplate.header("Cookie", "xxx");
    }
}
```

那么问题来了，我们应该如何拿到Cookie？其实这个问题也很简单，我们可以搞一个拦截器，然后把`HttpServletRequest`保存在 `ThreadLocal` 中即可

```java
@Component
public class LoginInterceptor implements HandlerInterceptor {

  public final static ThreadLocal<HttpServletRequest> THREAD_LOCAL_REQUEST = new ThreadLocal<>();

  @Override
  public boolean preHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler) throws Exception {
    THREAD_LOCAL_REQUEST.set(request);
    ...
      return HandlerInterceptor.super.preHandle(request, response, handler);
  }

  @Override
  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    ...
      THREAD_LOCAL_REQUEST.remove();
    HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
  }
}
```

而`SpringBoot` 也有这种工具提供，不需要我们额外写多余的类 `RequestContextHolder`，这个类的原理也是使用 `ThreadLocal`

```java
@Component
public class FeignFillContent implements RequestInterceptor {
  @Override
  public void apply(RequestTemplate requestTemplate) {
    // 获取请求上下文
    ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    HttpServletRequest request = requestAttributes.getRequest();

    // 同步cookie
    String myCookies = request.getHeader("Cookie");
    requestTemplate.header("Cookie", myCookies);
  }
}
```

测试一下，B服务成功拿到用户登录信息

![测试](https://qiniu-note-image.ctong.top/note/images/202202252116894.png)

## 异步环境下问题重现

在单线程环境下没毛病，但在多线程，例如 `CompletableFuture` 下还是会出现问题，这次问题是我请求拦截器抛出空指针异常。

这个问题是因为 `ThreadLocal` 底层时Map，键使用的是当前线程对象，所以在单线程环境下没问题，一使用异步就出现问题。因为异步后是一个新的线程，已经不再是我们原来处理请求的那个线程了，所以通过当前线程对象是拿不到ThreadLocal中的数据的。

```java
// 获取购物项
CompletableFuture<Void> cartItemFuture = CompletableFuture.runAsync(() -> {
  R cartItem = cartFeignService.getCurrentUserCartItem();
  ...
}, executor);
```

## 解决

这个问题也很简单，就是共享 `ThreadLocal`也就是将指定 ThreadLocal 复制到指定线程的 ThreadLocal

```java
@Override
public OrderConfirmVo confirmOrder() {
  ...
    RequestAttributes myReqContext = RequestContextHolder.currentRequestAttributes();
  // 查询会员所有收货地址
  CompletableFuture<Void> memberFuture = CompletableFuture.runAsync(() -> {
    // 复制一份ThreadLocal
    RequestContextHolder.setRequestAttributes(myReqContext);
    R memberReceiveAddress = memberFeignService.getMemberReceiveAddress(mrv.getId());
    ...
  }, executor);

  // 获取购物项
  CompletableFuture<Void> cartItemFuture = CompletableFuture.runAsync(() -> {
    // 复制一份ThreadLocal
    RequestContextHolder.setRequestAttributes(myReqContext);
    R cartItem = cartFeignService.getCurrentUserCartItem();
    ...
  }, executor);

  CompletableFuture.allOf(memberFuture, cartItemFuture).join();
  return vo;
}
```

![结果](https://qiniu-note-image.ctong.top/note/images/202202252142071.png)
