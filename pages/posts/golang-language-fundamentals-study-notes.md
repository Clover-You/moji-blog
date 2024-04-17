---
title: Golang 语言基础学习笔记
tags: Golang
lang: zh-CN
date: 2024-04-15 10:34:30
categories: note,golang
pid: 6f604b36-5d8f-4227-ac85-db43927cf53b
last-edit: 2024-04-15 14:23:49
duration: 110min
author: Clover
---
## 变量

变量时程序的基本组成单位，无论是使用哪个编程语言来进行开发，变量都是其程序的基本组成单位.

1. 变量表示内存中的一个存储区域，该区域有属于自己的名称（变量名 ）和类型（变量类型）

Golang 变量有三种使用方式

1. 指定变量类型，声明后若不赋值则使用默认值

   ```go
   var num int // 0
   ```

2. 根据值自行判断变量类型（类型推断）

   ```go
   var num = 10 // int
   ```

3. 声明变量时省略 `var` 关键字，需要使用 `:=` 进行声明

   ```go
   num := 10
   ```

> 变量名在相同作用域中不能重复声明，否则会导致编译错误

在 Go 语言中，同类型的变量支持同时声明

```go
var one, two, three int
fmt.Println("one =", one, "two =", two, "three =", three)
```

```shell
# clover @ MacBook-Pro in ~/dev/go/learn/src/go_code/learn/variable [22:54:40] C:1
$ go run main.go
one = 0 two = 0 three = 0
```

不同类型的变量也是可以同时声明的，但是不推荐这么做

```go
var age, name = 20, "clover"
fmt.Println("age =", age, "name =", name)
```

```shell
# clover @ MacBook-Pro in ~/dev/go/learn/src/go_code/learn/variable [22:57:21] C:1
$ go run main.go
age = 20 name = clover
```

如果需要同时定义不同类型的变量，那么推荐这样

```go
var age int, name string
```

在 Go 语言中，任何在方法外部定义的变量都是全局变量，定义方式和以上方式是一样的。全局变量不被使用时不会导致编译错误

```go
package main

import "fmt"

var author = "clover"

func main() {
 fmt.Println("author =", author)
}
```

```shell
# clover @ MacBook-Pro in ~/dev/go/learn/src/go_code/learn/variable [22:58:12]
$ go run main.go
author = clover
```

还可以这样定义

```go
package main

import "fmt"

var (
    author = "clover"
    age = 20
)

func main() {
 fmt.Println("author =", author, "age =", age)
}
```

### 注意

1. 同一个作用域的数据值在同一类型中可以不断变化

   ```go
    var integer int = 10

    integer = 20 // v
    integer = 30 // v
    integer = 1.1 // x

    fmt.Println("integer =", integer)
   ```

   执行该代码后会得到一个错误，该错误表示无法将 `1.1` 赋值给 `int` 类型

   ```shell
   # clover @ MacBook-Pro in ~/dev/go/learn/src/go_code/learn/variable [23:17:44]
   $ go run main.go
   # command-line-arguments
   ./main.go:26:12: cannot use 1.1 (untyped float constant) as int value in assignment (truncated)
   ```

2. 变量在同一作用域中不能重复定义，

   例如以下代码，这是不允许的

   ```go
   func main() {
       var num = 10
       fmt.Println("num =", num)
       var num = 11
       fmt.Println("num =", num)
   }
   ```

   在不同作用域中可以重复定义

   ```go
   func main() {
    var num = 10
    fmt.Println("num =", num)
    {
     var num = 11
     fmt.Println("num inner scope =", num)
    }
   }
   ```

   通过 `go run` 命令去执行是可以通过编译的

   ```shell
   # clover @ MacBook-Pro in ~/dev/go/learn/src/go_code/learn/variable [23:17:52] C:1
   $ go run main.go
   num = 10
   num inner scope = 11
   ```

3. 变量构成的三要素：变量名 + 数据值 + 数据类型

4. Go 语言的变量如果没有初始值，那么编译器会使用默认值，例如：数值类型的变量，默认值就是为 `0` ，而 `string` 类型的变量默认值为**空字符串**

### 数据类型

- 基本数据类型
  1. 数值类型：`int` `int8` `int16` `int32` `int64` `uint` `uint8` `uint16` `uint32` `uint64`
  2. 字符类型：在 Go 中没有类似 Java 中的 `char` 类型，但是可以通过 `byte` 来保存单个**字母**字符。`int` 系列类型也可以保存字符

  ```go
     var ni int16 = '你'
     var a int8 = 'a'
     var b byte = 'b'
     ```

  3. 浮点类型：`float32` `float64`

  4. 布尔类型：`bool`

  5. 字符串：`string` 与其它语言不同的是，字符串在 Go 中被作为基本数据类型

  6. 结构体(struct)

  7. 数组

- 派生/复杂数据类型/引用数据类型

  1. 指针 (Pointer)
  2. 数组
  3. 结构体 (struct)
  4. 管道 (Channel)
  5. 函数
  6. 切片
  7. 接口
  8. map

#### 整数类型

| 类型       | 有无符号 | 存储空间      | 数据范围                                   | 备注                                     |
| -------- | ---- | --------- | -------------------------------------- | -------------------------------------- |
| `int8`   | 有    | 1字节       | -128 ~ 127                             |                                        |
| `int16`  | 有    | 2字节       | -2^15 ~ 2^15 - 1                       |                                        |
| `int32`  | 有    | 4字节       | -2^31 ~ 2^31 - 1                       |                                        |
| `int64`  | 有    | 8字节       | -2^63 ~ 2^63 - 1                       |                                        |
| `uint8`  | 无    | 1字节       | 0 ~ 255                                |                                        |
| `uint16` | 无    | 2字节       | 0 ~ 2^16 - 1                           |                                        |
| `uint32` | 无    | 4字节       | 0 ~ 2^32 - 1                           |                                        |
| `unit64` | 无    | 8字节       | 0 ~ 2^64 - 1                           |                                        |
| `int`    | 有    | 计算机最大支持位数 | -2^31 ~ 2^31 - 1<br />-2^63 ~ 2^63 - 1 | 如果当前计算机支持64位，那么他就是64。如果计算机是32位，那么他就是32 |
| `uint`   | 无    | 计算机最大支持位数 | 0 ~ 2^32 - 1<br />0 ~ 2^64 - 1         |                                        |
| `rune`   | 有    | 4字节       | -2^31 ~ 2^31 - 1                       | 与 `int32` 类似，表示一个 **Unicode** 码        |
| `byte`   | 无    | 1字节       | 0 ～ 255                                | 在需要存储**字符**时可以使用它                      |

#### 浮点类型

浮点型也被叫做小数类型，例如：1.1、0.1...
在初始化时若不指定变量类型，`float` 默认声明为 `float64`

| 类型            | 存储空间 | 表数范围                   |
| ------------- | ---- | ---------------------- |
| 单精度 `float32` | 4字节  | -3.403E38 ~ 3.403E38   |
| 双精度 `float64` | 8字节  | -1.798E308 ~ 1.798E308 |

浮点数在机器中存放形式为：符号位 + 指数位 + 尾数位
**注意：浮点数在存储过程中可能会有精度丢失问题，跟金钱相关的数值，一定要记住并解决，不应该使用浮点**

#### 字符类型

在 Go 语言中，没有专门的字符类型(类似 Java 中的 `char` )，如果要存储单个字符，一般使用 `byte` 来保存。
大多数语言字符串是一串固定长度的字符连接起来的字符序列。**Go 的字符串不同，它是由字节组成的**。通过单引号来表示一个字符。

```go
var one byte = '1'
var a byte = 'a'
println(one, a)
```

上面的代码在执行之后，输出的值并不是我们期望的 `1` 和 `a` ，这是因为它保存的是对应的 ASCII 码

```shell
# clover @ MacBook-Pro in ~/dev/go/test-gin [22:56:15] C:1
$ go run main.go
 49 97
```

如果我们的字符是一个汉字，那么程序会出错，因为 `byte` 最大范围是 0 ~ 255，汉字对应的码值远大于它。所以只要我们使用更大字节的类型就可以存储汉字字符

```go
var you rune = '你' // int16 也可以
```

> 在某种情况下，我们可以通过  `unsafe.Sizeof(xx)` 方法来查看一个变量所占用的字节数大小。
>
> 在保证程序正常运行下，尽量使用占用空间小的数据类型

如果需要输出中文，那么可以使用格式化输出，注意 `%c` 是把一个 Unicode 编码转为中文。

```go
var you rune = '你'
fmt.Printf("%c", you)
var char = fmt.Sprintf("%c", you)
println("char =", char)
```

- 字符是通过单引号 `''` 括起来的单个字符，例如: `var a byte = 'a'`
- Go 中允许使用转译字符 `\` 来将其后的字符转译为特殊字符
- Go 语言的字符使用 UTF-8 编码，英文占用1个字节，中文2个字节
- Go 中字符的本质是一个整数，直接输出时，是该字符对应的 UTF-8 编码的值。
- 可以直接给某一个变量绑定一个数字，然后通过格式化输出 `%c` ，会将输出的数字转为对应的 Unicode 字符
- 字符类型是可以进行运算的，因为在 Go 中字符是被单做整数。

#### 布尔类型

- 布尔类型也叫做 `bool` 类型，bool 类型数据只允许取值 `true` 和 `false`
- bool 类型占用 1 个字节
- boolean(bool) 类型适用于逻辑运算，一般用于程序流程控制

```go
var boolean bool = false
```

#### 字符串类型

- 在 Go 语言中，字符串被作为基本数据类型，并且默认使用 UTF-8 编码来进行处理。
- 字符串一旦赋值之后就不允许再次更改，**在 Go 中，字符串是不可变的**
- 字符串的两种表示形式
  1. 双引号会识别转译字符，例如 `\n \"`
  2. 反引号，以字符串的原生形式输出，包括换行和特殊字符，可以实现防止攻击、输出源代码等效果。
     以下内容会被原文输出

     ```go
      var str string = `
        package main

        import "fmt"

        func main() {
          var you rune = '你'
          fmt.Printf("%c", you)
          var char = fmt.Sprintf("%c", you)
          println("char =", char)

          var str string = "\n"
        }
      `
      fmt.Println(str)
     ```

- 字符串允许使用符号 `+` 和 `+=` 进行拼接

  ```go
  var hello = "hello" + " world"
  hello += "!"

 fmt.Println(hello)

  ```

  有一点需要注意的是，当拼接多行字符串需要换行时，符号 `+` 不允许换行，而是保留在当前行。

  ```go
  var str =  "hello" + " world"
     +  "hello" + " world" // 这是不允许的

  var str1 =  "hello" + " world" +
    "hello" + " world" // 这是正确的
  ```

#### 基本数据类型的默认值

在 Go 中，数据类型都有一个默认值，当一个类型没有赋值时就会保留默认值，在 Go 中默认值又叫零值

|数据类型|默认值|
|-------|-----|
|整型|0|
|浮点型|0|
|字符串|""|
|布尔类型|false|

### 基本数据类型的转换

在 Go 语言中，不同数据类型的变量之间赋值时需要**显示转换**，也就是说 Golang 中数据类型不能像 Java 一样可以自动转换。它的基本语法为 `T(v)` ，将值v转为类型 T

```go
var age int16 = 1
var age1 int32 = int32(age)
```

> Go 中支持小类型转大类型，也支持大类型转小类型。但是注意，大类型转小类型，可能会出现精度问题

#### string 和其他基本数据类型的相互转换

在我们日常开发中，经常需要将 `string` 数据类型转成其他数据类型，例如 `int`。或者将其他基本类型转成 `string`

#### 其它基本数据类型转 string

可以使用 `fmt` 包提供的 `Sprintf` 或 `Sprint` 方法将其他类型转为 `string`

```go
var age int = 20
var ageStr = fmt.Sprint(age)
println(ageStr)
```

Go 也提供了相应的类型转换包 `strconv`，调用它里面的一些函数就可以将指定的类型转为字符串

```go
func FormatBool(b bool) string
func FormatComplex(c complex128, fmt byte, prec, bitSize int) string
func FormatFloat(f float64, fmt byte, prec, bitSize int) string
func FormatInt(i int64, base int) string
func FormatUint(i uint64, base int) string
```

参数 `base` 表示需要转成几进制的字符串，如果需要转 10 进制，`base` 设置为 10 就可以：

```go
var age int64 = 20
var ageStr = strconv.FormatInt(age, 10) // 输出20
```

同时也可以使用 `Itoa` 方法对 `int` 进行转换，它底层默认调用 `FormatInt` 并且 `base` 为 10

#### string 转其它基本数据类型

可以使用 `strconv` 包下的这些函数将一个字符串转为指定的基本数据类型。

```go
func ParseBool(str string) (bool, error)
func ParseComplex(s string, bitSize int) (complex128, error)
func ParseFloat(s string, bitSize int) (float64, error)
func ParseInt(s string, base int, bitSize int) (i int64, err error)
func ParseUint(s string, base int, bitSize int) (uint64, error)
```

假设将一个 `string` 转为 `int`

```go
var age int64 = strconv.ParseInt("20", 10, 64)
```

这些 `parse` 方法需要3个参数，`s` 参数是指定转换的值，`base` 是表示这个值是几进制的。`bitSize` 是限制这个值是否大于指定的位数，支持 `0、8、16、32、64` 。如果给定的数大于 `bitSize`，那么会抛出一个错误。

> 在将 `string` 类型转为其它基本类型时，需要确保 `string` 类型是一个有效的数字字符串，否则转换失败。例如以下代码，`hello` 明显不是一个数字字符串。
>
> ```go
> strconv.ParseInt("hello", 10, 64)
> ```

### 基本数据类型和引用数据类型

1. 基本数据类型变量直接存储值，内存**通常**是分配在栈区

   ```go
   var num = 100
   ```

   <!-- ![基本数据类型内存图](/images/golang-language-fundamentals-study-notes-basic-data-type-memory-diagram.png) -->
   <img src="/images/golang-language-fundamentals-study-notes-basic-data-type-memory-diagram.png" class="filter dark:invert" />

2. 引用类型：变量存储的是一个地址，这个地址对应的空间才是真正存储对应的值，内存**通常**在堆上分配。当没有任何变量引用这个地址时，该地址对应的空间就会成为一个垃圾，等待GC进行回收。
   <img src="/images/golang-language-fundamentals-study-notes-ref-data-type-memory-diagram.png" class="filter dark:invert" />

## 指针

1. 基本数据类型，变量存的是一个值，基本数据类型也叫做值类型。

2. 获取变量的内存地址，我们可以使用 `&` 符号，例如:

   ```go
   var num int = 10
   fmt.Println("num =", &num)
   ```

   ```shell
   # clover @ MacBook-Pro in ~/dev/go/learn/src/go_code/learn/pointer [20:52:39]
   $ go run main.go
   num = 0xc0000180a8
   ```

3. 指针类型，`*T` 类型就是一个指针，指针变量存的是一个地址，这个地址指向的空间存的才是真正的值，例如:

   ```go
   var num int = 10
   var prt *int = &num
   ```

   所谓的指针，其实就是一个存了其它变量内存地址的变量，例如以上代码

   ```
   假设：num 内存地址是 0xc0000180a8，prt 内存地址是 0xc000012028
   prt: 0xc000012028 --> 0xc0000180a8 --> 10
   ```

4. 如果需要获取指针类型所指的指，可以使用 `*` 符号来取

   ```go
   var num int = 10
   var prt *int = &num
   fmt.Println("prt =", *prt)
   ```

   ```shell
   # clover @ MacBook-Pro in ~/dev/go/learn/src/go_code/learn/pointer [21:07:38]
   $ go run main.go
   prt = 10
   ```

指针的简单用法：

```go
var num int = 9
var prt *int = &num

*prt = 10

fmt.Println(num) // 这里输出10而不是原先的9
```

## 关系运算符

1. 关系运算符的结果都是 `bool` 型，也就是要么是 `true` ，要么是 `false`
2. 关系表达式通常用在 `if` 结构的条件中或者循环结构的条件中

| 运算符  | 运算   | 例子       | 结果      |
| ---- | ---- | -------- | ------- |
| `==` | 相等于  | `4 == 3` | `false` |
| `!=` | 不等于  | `4 != 3` | `true`  |
| `<`  | 小于   | `4 < 3`  | `false` |
| `>`  | 大于   | `4 > 3`  | `true`  |
| `<=` | 小于等于 | `4 <= 3` | `false` |
| `>=` | 大于等于 | `4 >= 3` | `true`  |

以下为示例代码：

```go
if 4 > 3 {
  fmt.Println("4 > 3")
}

if 4 < 3 {
  fmt.Println("4 < 3")
}

for i := 0; i < 10; i++ {
  fmt.Println("i =", i)
}
```

### 逻辑运算符

| 运算符  | 描述                                                  | 实例             |                                                  |        |     |        |
| ---- | --------------------------------------------------- | -------------- | ------------------------------------------------ | ------ | --- | ------ |
| `&&` | 逻辑与运算符，如果左右两边的表达式结果都为 `true` 则 为 `true` 否则为 `false` | `4>3 && 4 <10` |                                                  |        |     |        |
| `    |                                                     | `              | 逻辑或运算符，两边的表达式其中有一个为 `true` 则为 `true` 否则为 `false` | `4 > 3 |     | 4 < 5` |
| `!`  | 逻辑非运算，如果表达式结果为 `true` 则为 `false` 否则为 `true` （对结果取反） | `!(4 > 3)`     |                                                  |        |     |        |

```go
var num int = 10
if (num > 3 && num < 20) || num > 50 {
  fmt.Println("num 的值大于3小于20或者大于50")
}
```

### 赋值运算符

| 运算符  | 描述                   | 实例                      |
| ---- | -------------------- | ----------------------- |
| `=`  | 赋值运算符，讲一个表达式的值赋给一个左值 | `a = 1 + 2` 1 + 2的结果赋给a |
| `+=` | 相加后再赋值               | `C += A` 等于 `C = C + A` |
| `-=` | 相减后再赋值               | `C -= A` 等于 `C = C - A` |
| `*=` | 相乘后再赋值               | `C *= A` 等于 `C = C * A` |
| `/=` | 相除后再赋值               | `c /= A` 等于 `C = C / A` |
| `%=` | 求余后再赋值               | `C %= A` 等于 `C = C % A` |

## 进制

对于整数，有四种表示方式

1. 二进制：0，1，满2进1
   在 Go 语言中，不能直接使用二进制来表示一个整数，它沿用了 C 语言的特点。

2. 十进制：0-9，满10进1

3. 八进制：0-7，满8进1，以数字0开头表示

4. 十六进制：0-9及A-F，满16进1，以 `0x` 或 `0X` 开头表示

   > A-F是不区分大小写。

进制转换的规则：

从最低位开始（右边），将每个位上的数提取出来，乘以目标进制(如果是二进制，那么就是乘以2)的(位数-1)次方，然后求和。

十进制转二进制

将该数不断除以2，直到商为0，然后将每步得到的余数倒过来，就是对应的二进制

### 源码、补码、反码

1. 二进制最高位是符号位：0表示正数，1表示负数
2. 正数的源码、补码、反码都一样
3. 负数的反码：原符号位不变，其它位取反
4. 负数的补码是它的反码+1
5. 0的反码补码都是0
6. 在计算机运算时，都是以补码的方式进行

## 函数

函数是为完成某一功能的程序指令（语句）的集合称为函数。在 Go 中，函数分为：自定义函数和系统函数。

### 函数的定义

以下是函数的基本语法 描述：

```go
func 函数名(形参列表) (返回值类型列表) {
  ...语句块
  return 返回值1, 返回值2
}
```

1. 形参列表表示函数的输入

2. 函数中的语句表示为了实现某一功能的代码块

3. 函数可以有返回值，也可以没有，在 Go 语言中，一个函数可以有多个返回值

4. 返回多个值时，如果不使用那么会出现错误，可以使用 `_` 符号占位忽略

   ```go
   var val, _ = getVal()
   ```

5. 如果返回值只有一个，那么在声明函数的时候可以省略返回值类型的 `()`

   ```go
   func getVal() int {
     return 1
   }
   ```

6. 基本数据类型和数组默认都是值传递的，也就是值拷贝，在函数内修改，是不会影响到原来的值

7. 在 Go 中，函数也是一种数据类型，可以赋值给一个变量，通过该变量可以对函数进行调用

   ```go
   func main() {
    increment(cal)
     // 也可以使用下面这种方式来传递
     increment(func (num int) int {
       return 1
     })
   }

   func cal(num int) int {
    return 1
   }

   // 创建一个函数类型
   type GetVal = func(num int) int

   func increment(getVal GetVal) int {
    return getVal(123)
   }

   ```

可以通过函数名加上小括号去调用指定的函数

```go
func main() {
  var result = increment(1, 2)
  fmt.Println("result =", result) // 3
}

func increment(max int, min int) int {
  return max + min
}
```

### init 函数

每一个源文件都可以包含一个 `init()` 函数，该函数会在 `main()` 函数执行前被 Go 运行框架调用，也就是说 `init()` 会在 `main()` 函数前被调用。

```go
import "fmt"

func main() {
 fmt.Println("main 函数被执行了")
}

func init() {
 fmt.Println("inti 函数被执行了")
}
```

以上代码 `init()` 函数会先于 `main()` 函数执行：

```shell
➜  go-learn go run go-func.go
inti 函数被执行了
main 函数被执行了
```

在 Go 语言中，变量和函数的定义顺序是:

全局变量 ---> `init()` ---> `main()`

`init()` 函数的作用通常是用来完成一些初始化工作，例如初始化一些程序运行时必要的全局数据。

### 匿名函数

Go 支持匿名函数，如果我们某个函数只是希望被只用一次，可以使用匿名函数，匿名函数也可以实现多次调用。

```go
var MyFun = func() {
 fmt.Println("MyFunc")
}

func main() {
 MyFun() // 调用全局匿名函数
 var localFun = func ()  { // 定义一个局部匿名函数
  fmt.Println("local func") // 使用局部定义的匿名函数
 }
 localFun()
}
```

## defer 关键字

在函数中，我们经常需要创建资源，比如：连接数据库、文件句柄、锁...为了在函数执行完毕后及时释放资源，Go 的设计者提供了一个 `defer` 关键字，它类似 Java、JavaScript 语言中的 `finally` 关键字。

```go
func main() {
 fmt.Println("01")
 defer fmt.Println("02")
 fmt.Println("03")
}
```

这段代码的执行顺序如下所示:

```shell
➜  go-learn go run defer.go
01
03
02
```

一个函数中可以存在多个 `defer` ，这些 `defer` 会在最后时刻被先入后出的方式执行。

需要注意一点，`defer` 执行时是被压入一个栈中，在入栈的时候，如果使用了 **值** ，那么该值会被**拷贝**

```go
func main() {
 var num int = 10
 fmt.Println("num", num)
 num += 1
 defer fmt.Println("num1 =", num)
 defer fmt.Println("num2 =", num)
 num += 1
}
```

执行以上代码就可以发现这一规则:

```shell
➜  go-learn go run defer.go
num 10
num2 = 11
num1 = 11
```

## 字符串中的常用函数

1. 统计字符串的长度，按字节进行统计: `len(str)`

2. 字符串遍历，同时处理中文乱码的问题: `r := []rune(str)`

3. 字符串转整数: `n, err := strconv.Atoi("12")`

4. 整数转字符串: `str = strconv.ltoa(12345)`

5. 字符串转 `[]byte` : `var bytes = []byte("hello world")`

6. `[]byte` 转字符串: `str := string([]byte("hello world"))`

7. 10 进制转其他进制: `str = string.FormatInt(123, 进制)`

8. 查找子串是否在指定的字符串中: `string.Contains("seafood", "foo")` 该函数返回布尔值以表示是否找到结果

9. 统计一个字符串有几个指定的子串: `strings.Contains("awseesdawee", "e")`

10. 不区分大小写的字符串比较: `strings.EqualFold("abc", "Abc")`

11. 返回子串在字符串第一次出现的位置，如果没有则返回 `-1` : `strings.Index("NLT_abc", "abc")`

12. 返回子串在字符串中最后一次出现的位置，如果没有则返回 `-1` : `strings.LastIndex("go golang", "go")`

13. 将指定的子串替换成另外一个子串: `strings.Replace("go go hello", "go", "golang", 1)` 。此处这个参数 1 表示需要替换几个。

14. 按照指定的某个字符，为分割标识，将一个字符串拆分成字符串数组: `strings.Split("hello, world,ok", ",")`

15. 将字符串的字母进行大小写的转换:

    ```go
    strings.ToLower("Go") // go
    strings.ToUpper("go") // GO
    ```

16. 将字符串左右两边的空格去掉: `strings.TrimSpace(" saw  ")`

17. 将字符串左右两边指定的字符去掉: `strings.Trim("! sas! ", "!")` ，将左右两边的 `!` 和空格去掉

18. 将字符串左边指定的字符去掉: `strings.TrimLeft("! hello!")`

19. 将字符串右边指定的字符去掉： `strings.TrimRight("!hello!", "!")`

20. 判断字符串是否以指定的字符串开头: `strings.HasPrefix("https://www.ctong.top", "htps://")`

21. 判断字符串是否以指定的字符串结束: `strings.HasSuffix("https://www.ctong.top", ".rop")`

## 日期时间相关函数

在编程中，我们经常会使用到日期相关的函数，比如：统计某段代码执行花费的时间。

日期相关的操作函数都在 `time` 包下

### time.Time

在 Go 中，有一个 `time.Time` 类型，用于表示时间

```go
var dt time.Time = time.Now()
fmt.Println(dt)          // 2023-05-15 20:24:38.562418 +0800 CST m=+0.000108054
fmt.Println(dt.Year())   // 2023
fmt.Println(dt.Month())  // May
fmt.Println(dt.Day())    // 15
fmt.Println(dt.Hour())   // 20
fmt.Println(dt.Minute()) // 31
fmt.Println(dt.Second()) // 59
```

`dt.Month` 默认返回的是英文，可以通过类型转换将他转成对应的数字。

```go
fmt.Println(int(dt.Month())) // 5
```

### 时间格式化

格式化日期的一种方式，注意 Go 的答辩设计...不能使用传统的 `yyyyMMdd` 这种方式进行格式化。

```go
var dt time.Time = time.Now()
fmt.Println(dt.Format("2006/01/02 15:04 56")) // 2023/05/15 20:43 206
fmt.Println(dt.Format("2006-01-02 15:04 56")) // 2023-05-15 20:43 206
```

### 时间常量 Duration

常量的作用在于获取指定时间单位的时间，例如我要获取两个小时是多少秒，在之前我们需要通过 `2 * 60 * 60` ，现在我们可以直接通过这个常量进行计算就可以了：

```go
fmt.Println((2 * time.Hour).Seconds()) // 7200
```

```go
const (
 Nanosecond  Duration = 1
 Microsecond          = 1000 * Nanosecond
 Millisecond          = 1000 * Microsecond
 Second               = 1000 * Millisecond
 Minute               = 60 * Second
 Hour                 = 60 * Minute
)
```

### 休眠

在 `time` 包中有一个 `Sleep` 函数，他可以阻塞当前线程休眠指定的时间，这个方法类似于 java 中的 `Thread.sleep()` 方法。

```go
for i := 0; i < 100; i++ {
  fmt.Print(i, "%\r")
  time.Sleep(time.Second)
}
```

### Unix 时间戳

获取但前 unix 时间戳 和 unixnano 时间戳。

通过 `time.Now().Unix()` 函数获取从 1970 年 1 月 1 日到现在的时间，单位是秒

```go
var dt time.Time = time.Now()
fmt.Println(dt.Unix()) // 1684156990
```

而 `time.Now().UnixNano()` 函数是从 1970 年 1 月 1 日到现在的纳秒

```go
var dt time.Time = time.Now()
fmt.Println(dt.UnixNano()) // 1684157036232992000
```

## 内置函数

Golang 设计者为了编程方便，提供了一些内置函数，这些函数可以直接使用，可以看中文文档的描述：[传送门里面的 Builtin](https://studygolang.com/pkgdoc)

### len

`len` 函数用来取长度，比如它可以取：`string` `array` `slice` `map` `channel`

```go
func main() {
 var str = "hello world"
 var arr = []int{1, 2}
 fmt.Println(len(str))
 fmt.Println(len(arr))
}
```

输出结果如下

```shell
➜  go-learn go run builtin.go
11
2
```

### new

`new` 函数用来分配内存，主要用来分配值类型，比如 `int` `float32` `struct` ... 返回的是指针。

它的源码描述是这样的：

```go
func new(Type) *Type
```

这个函数有一点类似我们取脂针的写法：

```go
var num int = 100
var numPrt *int = &num
```

使用 `new` 函数只不过是简写了以上代码，不过需要注意的是，它所指向的值是一个 **零** 值

```go
var numPrt *int = new(int)
```

## 错误处理

> 不得不说体验非常糟糕，如果没有判断 `err != nil` 那么可能会造成严重业务事故，因为 err 不会影响程序执行！

在 Go 中如果遇到错误，该如何处理？可以看下最常见的除零异常：

```go
num := 10
fmt.Println(num / 0)
```

可以发现，当我们直接运行上面的代码的时候，程序抛出了一个异常并且程序直接退出了

```shell
➜  go-learn go run error_handler.go
# command-line-arguments
./error_handler.go:9:20: invalid operation: division by zero
```

在程序中，我们往往会发生一些错误（panic），但是这些错误我们希望能够感知并处理，而不是直接将程序退出。

在 Go 语言中，不支持传统的 `try...catch` 这种处理方式，而是引入了：`defer` `panic` `recover` 来进行错误处理。

例如：在程序中可以抛出一个 `panic` 异常，然后在 `defer` 中通过 `recover` 去捕获这个异常进行处理。

```go
func main() {
 test()
 fmt.Println("我来证明程序没有退出....")
}

func test() {
 defer func() {
  err := recover()
  if err != nil {
   fmt.Println("err =", err)
  }
 }()
 num := 10
 num2 := 0
 fmt.Println(num / num2)
}
```

错误处理后，可以让我们的程序更加健壮，如果在一些必要的流程，我们还可以加入预警代码，例如发生错误后将错误信息以邮件、短信等方式通知开发者处理。

### 自定义错误

在 Go 程序中，也可以自定义错误，使用 `errors.New`  和 `panic` 内置函数。

1. `errors.New("错误说明")` 会返回一个 `error` 类型的值，表示一个错误。
2. `panic` 内置函数接收一个 `interface {}` 类型的值作为参数，也可以接收一个 `error` 类型的变量，他可以输出一个错误消息并推出程序。

```go
func main() {
 fmt.Println("hello world")
 data, err := invoke()

 if err != nil {
  fmt.Println("即将抛出异常并推出程序")
  panic(err)
 }

 fmt.Println("数据是 ===>", data)
}

func invoke() (data string, err error) {
 err = throw_error("clove")
 if err != nil {
  return "错误", err
 }
 return "输入正确", nil
}

func throw_error(fileName string) (err error) {
 if fileName != "clover" {
  return errors.New("输入错误")
 }
 return nil
}
```

## 数组与切片

数组可以存放多个同一类型的数据，数组也是一种数据类型，在 Go 中，数组是值类型。

例如有这么一个需求，需要求 10、2、3、4.0、50 这些数的平均值，我们可以这么做：

```go
func main() {
 num1 := 10.0
 num2 := 2.0
 num3 := 4.0
 num4 := 50.0

 sum := num1 + num2 + num3 + num4
 avg := sum / 4
 println("avg =", avg)
}
```

这或许看不出什么问题，但是如果再加一个需求，我的值可能是动态输入，且数量可能不同，很好，显然上面的代码不能做到。这时候我们可以使用数组来完成。

注意：在 Go 中，声明一个数组语法是 `[]T`

很显然，下面用数组实现的功能更强大，通过 `calc` 方法求和之后将值返回，可以使用 `fmt.Printf` 打印这个值，注意这里的 `%.2f` 是保留几位小数的意思！

```go
func main() {
 avg := calc([]float64{10, 2, 4, 50, 60, 70, 80})
 fmt.Printf("avg =%.2f", avg)
}

func calc(list []float64) (avg float64) {
 var sum = 0.0
 for _, num := range list {
  sum += num
 }
 return sum / float64(len(list))
}
```

- 数组可以通过下标进行取值，和其他编程语言一样，下标是从 0 开始。
- 要声明一个数组，可以通过语法 `[]T` 来声明，若需要指定数组的长度，那么可以使用 `[6]T` 来声明一个定长的数组。通过 `[]T{xxx, xxx, xx}` 来初始化一个数组。
- 数组只能存放同类型的数据，例如 `int` ，你指定一个 `[]int` 后，你不能再往这个数组里存入其他类型，例如：`[]int{1.34}` 这是不允许的。

### 数组内存布局

数组是一种数据类型，也是一种数据结构，它的优点是能够快速的进行读和写操作。对于删除和新增操作，他是比较慢的。因为数组每一个元素的内存地址它都是连续的。假设第一个元素是 `0x08` 那么第二个元素必然是 `0x10` 第三个是 `0x18`  以此类推...

**注意：以上 `0x08` 中的 `8` 是根据你这个数组的类型所占用的空间大小来计算的，例如数组类型是 `[]int` 一个 `int` 类型占 8 个字节，所以内存地址需要加8，如果是 `int32` 那么内存地址是加 4 或者是 `string` 那么内存地址需要加 16以此类推**

所以我们在通过数组下标取值的时候，实际上就是通过第一个数组内存地址和指定的下标值进行计算得出一个目标元素的内存地址。

数组的内存地址实际上就是我们第一个元素的内存地址。我们可以通过下面这段代码来证明：

```go
var arr  = [3]int{1, 2, 3}
fmt.Printf("arr prt = %p  ele1 prt =%p  ele2 prt =%p ele3 prt =%p", &arr, &arr[0], &arr[1], &arr[2])
```

打印输出我们可以发现，arr 的地址就是第一个元素的内存地址。

```shell
➜  go-learn go run array_slice.go
arr prt = 0xc0000aa018  ele1 prt =0xc0000aa018  ele2 prt =0xc0000aa020 ele3 prt =0xc0000aa028%
```

- 通过以上示例可以观察到，数组的内存地址是连续的。如果可以进行脂针运算的话，我们可以通过首元素的内存地址 + (类型占用字节数 乘 下标)得出我们指定下标下的元素。
