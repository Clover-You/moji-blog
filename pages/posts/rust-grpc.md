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
这是我使用的 proto 文件

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

在开始使用前，安装 protobuf

```shell
brew install protobuf
```

使用 Tonic 编译 gRPC 代码 <img src="https://img.shields.io/crates/v/tonic"/>

在项目中加入这个 crate。注意这个 crate 需要添加到 `[build-dependencies]`

```shell
cargo add tonic-build --build
```

在项目根目录中的 `build.rs` 文件中使用这个 crate 编写编译相关的代码。如果没有这个文件，可以手动创建一个。这个文件用于在构建 Rust 项目时执行自定义的构建脚本。这个脚本可以用于在编译时执行一些额外的任务，例如生成代码、检查依赖项、编译外部库、或根据环境变量配置构建过程。

`build.rs` 脚本会在你运行 `cargo build`、`cargo check`、`cargo run` 等命令时自动执行。它在构建 Rust 代码之前运行。

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

默认情况下会生成 Client 和 Server 代码，可以按需生成，我不希望它生成 Server 所以配置 `tonic_build::configure().build_server(false)` 。一切准备就绪后执行 `cargo build` 会将 proto 编译为 rust 代码，在你指定的目录下 `<out_dir>` 。

> 注意如果没有 out_dir 它不会帮你创建。也不会抛出任何错误

做完这些，还需要引入一些依赖：

`tonic` 实现了 gRPC 的 client 和 server

```shell
cargo add tonic
```

`prost` 对 gRPC 消息进行序列号和反序列化

```shell
cargo add prost
```

由于使用到了 `google.protobuf.Timestamp` ，需要加入 `prost-types` 对 gRPC 类型和一些其它比较知名的 gRPC 类型的支持。

```shell
cargo add prost-types
```

代码生成后编写客户端代码发起 gRPC 请求。

```rust
use std::str::FromStr;

use proto_demo::user::{self, SigninRequest};
use tokio::runtime::Builder;
use tonic::{metadata::MetadataValue, Request};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let mut cli = user::user_client::UseClient::connect("http://[::1]:8081")
  .await?;

  let mut req = Request::new(SigninRequest {
      email: "cloveryou02@gmail.com".to_string(),
      password: "123456".to_string(),
  });

  let metadata = req.metadata_mut();

  let token = MetadataValue::from_str("authentication token")?;
  metadata.append("authentication", token);

  let res = cli.signin(req).await?;
  let res = res.get_ref();

  println!("gRPC response result: {:?}", res);

  Ok(())
}
```

如果希望创建一个 gRPC server，可以参考以下代码

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
