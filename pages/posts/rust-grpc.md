---
title: Rust gRPC
date: 2024-08-13 15:02:48
lang: zh-CN
duration: 10min
pid: 64fa4f0e0050724937a88327037466b0be9d
tags: Rust
categories: Rust
lastEdit: 2024-08-13 15:04:16
---

在 gRPC 开发中，首先需要定义通信接口，这通常通过使用 Protocol Buffers（简称 Protobuf）来完成。Protobuf 是一种灵活、高效的序列化格式，广泛用于定义 gRPC 的消息格式和服务接口。以下是我们定义的 `proto` 文件，它描述了用户登录和获取用户信息的 gRPC 接口：

```proto
syntax = "proto3";
import "google/protobuf/timestamp.proto";

package user;

option go_package = "abi/grpc_user";

message SigninRequest {
  string email = 1;
  string password = 2;
}

message SigninResponse {
  string AccessToken = 1;
}

message GetUserInfoRequest {}

message GetUserInfoResponse {
  enum Gender {
    GENDER_UNKNOWN = 0;
    GENDER_GIRL = 1;
    GENDER_BOY = 2;
  }

  enum UserStatus {
    USER_STATUS_NORMAL = 0;
    USER_STATUS_BAN = 1;
    USER_STATUS_BAN_NOT_ACTIVATED = 2;
  }

  int64 uid = 4;
  string user_code = 5;
  string nickname = 1;
  string email = 2;
  Gender gender = 3;
  string avatar = 6;
  google.protobuf.Timestamp birth = 7;
  string phone_number = 8;
  UserStatus status = 9;
  google.protobuf.Timestamp created_at = 10;
}

service User {
  rpc Signin(SigninRequest) returns(SigninResponse);
  rpc GetUserInfo(GetUserInfoRequest) returns(GetUserInfoResponse);
}
```

### 安装并使用 Protobuf 编译 gRPC 代码

在使用 Protobuf 文件生成代码之前，首先需要安装 protobuf 编译器。它可以将 proto 文件编译成目标编程语言的代码，从而使这些语言可以直接使用这些定义。可以使用 Homebrew 来安装：

```shell
brew install protobuf
```

安装 protobuf 编译器后，需要在 Rust 项目中使用 `tonic-build` crate 来编译和生成 gRPC 客户端代码。`tonic-build` 是一个帮助你在 Rust 项目中构建 gRPC 客户端和服务器代码的工具。这需要在 `Cargo.toml` 的 `[build-dependencies]` 部分中加入：

```shell
cargo add tonic-build --build
```

在项目根目录下创建或修改 build.rs 文件。 这个文件用于在构建 Rust 项目时运行自定义构建脚本，它可以在编译过程中执行额外的任务，如代码生成、依赖项检查、外部库编译，或根据环境变量调整构建配置。在这里，我们将使用 `tonic-build` 来编译 proto 文件：

```rust
use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
  let out_dir = PathBuf::from("src");

  tonic_build::configure()
    .out_dir(&out_dir)
    .build_server(false)
    .compile(&["proto/user/user.proto"], &["proto"])?;

  Ok(())
}
```

在这里，`out_dir` 指定了生成代码的输出目录，我们将代码生成到 `src` 目录下。`build_server(false)` 表示只生成客户端代码，不生成服务器代码（默认情况下会生成 Client 和 Server 代码）。如果需要服务器代码，可以将其设置为 `true`。`compile(&["proto/user/user.proto"], &["proto"])` 则指定了需要编译的 `proto` 文件及其路径。**需要注意的是，如果指定的输出目录 `out_dir` 不存在，编译器不会自动创建它，因此你需要确保该目录已经存在。**

### 安装依赖库

做完这些，还需要引入一些依赖：

首先是 `tonic` ，它是一个 Rust gRPC 框架，提供了客户端和服务器端的实现，使你可以在 Rust 项目中轻松地构建和使用 gRPC 服务。

```shell
cargo add tonic
```

接着是 `prost` ，它用于处理 Protobuf 编码和解码。它可以将 Rust 数据结构序列化为 Protobuf 格式，并将 Protobuf 数据反序列化为 Rust 数据结构。

```shell
cargo add prost
```

由于在 `proto` 文件中使用到了 `google.protobuf.Timestamp`，还需要加入 `prost-types`，它提供了对一些标准 Protobuf 类型的支持，例如 `Timestamp`，这是 Protobuf 标准库的一部分。

```shell
cargo add prost-types
```

做完这些后只需要执行 `cargo build` 或者 `cargo run` 就可以生成 gRPC 代码了。

### 编写 gRPC 客户端

在生成了 gRPC 代码后，可以编写客户端代码来发起 gRPC 请求。以下是一个简单的客户端示例，它向 gRPC 服务器发送登录请求并获取响应：

```rust
use std::str::FromStr;

use proto_demo::user::{self, SigninRequest};
use tokio::runtime::Builder;
use tonic::{metadata::MetadataValue, Request};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let mut cli = user::user_client::UseClient::connect("http://[::1]:8081")
  .await?;

  // 构建 SigninRequest 请求
  let mut req = Request::new(SigninRequest {
      email: "cloveryou02@gmail.com".to_string(),
      password: "123456".to_string(),
  });

  // 获取请求的元数据进行修改
  let metadata = req.metadata_mut();

  // 将身份验证令牌添加到请求的元数据中
  let token = MetadataValue::from_str("authentication token")?;
  metadata.append("authentication", token);

  // 向服务器发送 Signin 请求，并等待响应
  let res = cli.signin(req).await?;
  let res = res.get_ref();

  println!("gRPC response result: {:?}", res);

  Ok(())
}
```

### 编写 gRPC 服务器

如果需要创建一个 gRPC 服务器，可以参考以下代码。这段代码展示了如何在 Rust 中实现一个简单的 gRPC 服务器：

```rust
use tonic::{transport::Server, Response};

use crate::user::{self, user_service_server::UserServiceServer};

#[derive(Default)]
pub struct UserService {}

#[tonic::async_trait]
impl user::user_service_server::UserService for UserService {
  async fn signin(
    &self,
    _request: tonic::Request<user::SigninRequest>,
  ) -> Result<Response<user::SigninResponse>, tonic::Status> {
    Ok(Response::new(user::SigninResponse {
      access_token: "123".to_string(),
    }))
  }

  async fn get_user_info(
    &self,
    request: tonic::Request<user::GetUserInfoRequest>,
  ) -> Result<Response<user::GetUserInfoResponse>, tonic::Status> {
      let metadata = request.metadata();
      let authentication = metadata.get("authentication").unwrap().to_str().unwrap();

      println!("{}", authentication);

      Ok(Response::new(user::GetUserInfoResponse {
        ..Default::default()
      }))
  }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let addr = "[::1]:8081".parse().unwrap();

  Server::builder()
    .add_service(UserServiceServer::new(UserService::default()))
    .serve(addr)
    .await?;

  Ok(())
}
```
