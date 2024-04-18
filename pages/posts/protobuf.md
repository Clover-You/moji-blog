---
title: Protobuf
date: 2024-04-18 14:18:15
lastEdit: 2024-04-18 15:10:49
lang: zh-CN
tags: gRPC
categories: Notes
duration:
pid: 0460db147d59974d38c8d416a388362c5aaf
author: Clover
---

Protobuf 全称是 `Protocol Buffers` 是谷歌在 2008 年开源的一个与语言无关、协议无关、可扩展的结构化数据序列化机制，能够在解包封包时更加快速，目前多用于 RPC 领域通讯相关，可以定义数据的结构化方式。然后可以使用特殊生成的源代码轻松地将结构化数据写入各种数据流和从各种数据流中读取结构化数据，并使用于各种语言。

目前 gRPC 就将其作为协议传输的序列化机制。

## 语法

一个 `protobuf` 文件大概长这样，他的语法非常简单十几分钟就能够快速上手。

```proto
syntax = "proto3";

message SearchRequest {
  string query = 1;
  string number = 2;
}

message SearchResult {
  string data = 1;
}

service SearchService {
  rpc Search(SearchRequest) returns(SearchResult);
}
```

- 第一行 `syntax = "proto3";` 表示使用 `proto3` 的语法，默认使用 `proto3` 的语法。
- `message` 声明的方式类似声明结构体，是 `proto` 中的基本结构。
- `SearchRequest` 中定义了三个字段，每个字段都会有名称和类型。
- `service` 中定义了一个服务，一个服务中包含一个或多个 rpc 接口。
- rpc 借口必须要有且智能有一个参数和返回值，他们的类型必须是 `message`，不能是基本类型。

**每个 proto 文件的每一行都必须要有分号结尾。**

### 注释

注释风格和其他现代语言基本一致。

```proto
syntax = "proto3";

/**
 * 查询条件
 */
message SearchRequest {
  string query = 2; // 查询参数
  string number = 2;
}
```

### 类型

类型修饰只能出现在 `message` 中，不能单独出现。

| proto Type | Golang Type | Rust Type | Java Type |
| ---------- | ----------- | --------- | --------- |
| double     | float64     | f64       | double    |
| float      | float32     | f32       | double    |
| int32      | int32       | i32       | int       |
| int64      | int64       | i64       | long      |
| uint32     | uint32      | u32       | int       |
| uint64     | uint64      | u64       | long      |
| sint32     | int32       | i32       | int       |
| sint64     | int64       | i64       | long      |
| fixed32    | uint32      | u32       | int       |
| fixed64    | uint64      | u64       | long      |
| sfixed32   | int32       | i32       | int       |
| sfixed64   | int64       | i64       | long      |
| bool       | bool        | bool      | bool      |
| string     | string      | String    | String    |
| bytes      | \[\]byte    | \[\&u8\]  | byte[]    |

### 数组

在基本类型前面加上 `repeated` 修饰符表示这是一个数组类型。

```proto
message Company {
  repeated string employee = 1;
}
```

### map

在 protobuf 中定义 map 类型

```txt
map<key_type, value_type> map_field = N;
```

`key_type` 必须是数字或者字符串，`value_type` 没有类型限制

```proto
message Person {
  map<string, int64> cards = 1;
}
```

### 字段

proto 并不是传统的键值类型，在声明的 proto 文件中是不会出现具体的数据的，每一个字段的 `=` 后面都应该是当前 `message` 中的唯一编号。这些编号用于在二进制消息体中识别和定义这些字段。编号从 1 开始，1-15 的编号会占用一个字节，16-2047 会占用两个字节。

一个 `message` 中的字段应当遵循一下规则

- `singular` 在一个良好的 `message` 中，有且只能有 0 个或者 1 个该字段，即能重复存在同一个字段，以下声明会在编译时出现错误。

  ```proto
  syntax = "proto3";

  message SearchRequest {
    string query = 1;
    string number = 2;
    string number = 3;//字段重复
  }
  ```

- `optional` 字段是否应该被设置
  - `set` 将会被序列化
  - `unset` 不会被序列化
- `repeated` 这种类型的字段可以出现 0 次或更多次，将会按照顺序保留重复值。（数组）
- `map` 键值对类型的字段

### 保留字段

### 弃用字段

当你的程序在今后的跟新迭代中可能会出现废弃字段的情况，那么需要作废这个字段而不是删除它或复用它的编号，这可能会导致出现问题，因为在业务中，是通过编号来确定一个数据的，如果复用，那么可能导致业务拿到错误的数据。

我们正确的做法是既不删除也不使用这个字段，而是弃用它。

```proto
message Body {
  string name = 1 [deprecated = true];
}
```
