---
title: Rust gRPC
date: 2024-08-13 15:56:48
lang: en
duration: 10min
pid: 072832f896f8f8475bc8405b9cfa1ec7015e
tags: Rust
categories: Rust
lastEdit: 2024-08-27 16:03:12
---

In gRPC development, the first step is to define the communication interfaces, which is typically done using Protocol Buffers (Protobuf for short). Protobuf is a flexible and efficient serialization format widely used for defining gRPC message formats and service interfaces. Below is the `proto` file we defined, which describes the gRPC interface for user login and retrieving user information:

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

### Installing and Using Protobuf to Compile gRPC Code

Before generating code from the Protobuf file, you need to install the protobuf compiler. It can compile proto files into code for the target programming language, allowing the language to directly use these definitions. You can install it using Homebrew:

```shell
brew install protobuf
```

After installing the protobuf compiler, you need to use the `tonic-build` crate in your Rust project to compile and generate gRPC client code. `tonic-build` is a tool that helps you build gRPC client and server code in Rust projects. Add the following to the `[build-dependencies]` section of your `Cargo.toml`:

```shell
cargo add tonic-build --build
```

Create or modify the build.rs file in the root directory of the project. This file is used to run custom build scripts when building the Rust project, and it can perform additional tasks during compilation, such as code generation, dependency checks, external library compilation, or adjusting build configurations based on environment variables. Here, we will use `tonic-build` to compile the proto files:

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

Here, `out_dir` specifies the output directory for the generated code, and we will generate the code into the `src` directory. `build_server(false)` indicates that only the client code is generated and not the server code (by default, both client and server code are generated). If you need server code, you can set it to `true`. `compile(&["proto/user/user.proto"], &["proto"])` specifies the `proto` files to compile and their paths. **It’s important to note that if the specified output directory `out_dir` does not exist, the compiler will not automatically create it, so you need to ensure that the directory already exists.**

### Installing Dependency Libraries

After doing this, you need to add some dependencies:

First, `tonic`, a Rust gRPC framework that provides client and server implementations, allowing you to easily build and use gRPC services in Rust projects.

```shell
cargo add tonic
```

Next, `prost`, which handles Protobuf encoding and decoding. It can serialize Rust data structures into Protobuf format and deserialize Protobuf data into Rust data structures.

```shell
cargo add prost
```

Since `google.protobuf.Timestamp` is used in the `proto` file, you also need to add `prost-types`, which provides support for some standard Protobuf types, such as `Timestamp`, which is part of the Protobuf standard library.

```shell
cargo add prost-types
```

After doing all this, simply run `cargo build` or `cargo run` command to generate the gRPC code.

### gRPC Client

Once the gRPC code is generated, you can write client code to initiate gRPC requests. Below is a simple client example that sends a login request to a gRPC server and receives a response:

```rust
use std::str::FromStr;

use proto_demo::user::{self, SigninRequest};
use tokio::runtime::Builder;
use tonic::{metadata::MetadataValue, Request};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let mut cli = user::user_client::UseClient::connect("http://[::1]:8081")
  .await?;

  // Construct SigninRequest request
  let mut req = Request::new(SigninRequest {
      email: "cloveryou02@gmail.com".to_string(),
      password: "123456".to_string(),
  });

  // Modify the metadata of the request
  let metadata = req.metadata_mut();

  // Add authentication token to the request metadata
  let token = MetadataValue::from_str("authentication token")?;
  metadata.append("authentication", token);

  // Send Signin request to the server and wait for response
  let res = cli.signin(req).await?;
  let res = res.get_ref();

  println!("gRPC response result: {:?}", res);

  Ok(())
}
```

### gRPC Server

If you need to create a gRPC server, you can refer to the following code. This code demonstrates how to implement a simple gRPC server in Rust:

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
