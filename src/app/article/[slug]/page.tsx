import type { Metadata } from "next"
import { notFound } from "next/navigation"
import initHexo from "#/hexo/hexo"
import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

import styles from "./article.module.css"
import "./theme.css"

interface Props {
  params: {
    slug: string
  }
}

// 静态metadata
// export const metadata: Metadata = {
//   title: ''
// }

// dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Clover'sBlog - Rust 从入门到入土"
  }
}

export async function generateStaticParams() {
  return [{
    slug: "java-base"
  }]
}

export default async function PostPage(props: Props) {

  return <>
    <div id="article-container" className={styles.TrmPublication}
      dangerouslySetInnerHTML={{ __html: post.content }}>
      <h1 id="数据类型"><a href="#数据类型" className="headerlink" title="数据类型"></a>数据类型</h1><blockquote>
        <p>创建于 2023-04-12 16:59</p>
        <p>本笔记主要来自于 <a href="https://rustwiki.org/zh-CN/book/title-page.html#rust-%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E8%AF%AD%E8%A8%80">Rust 程序设计语言 中文版</a> [3.2]，旨在记录个人学习过程中的重点和心得体会。在记录过程中，笔者会对文档中的某些内容进行摘抄或修改，并添加自己的注释或说明。如有不当之处，请指正。</p>
      </blockquote>
      <p>Rust 的每个值都有数据类型，该类型告诉 Rust 数据是被指定成哪种类型从而让 Rust 知道如何使用该数据。</p>
      <p>Rust 是一种<strong>静态类型</strong>语言，它必须在编译期就知道所有变量的类型。编译器通常可以根据使用值和使用方式推导出我们想要使用的类型。对于类型可能是多种的情况下，我们必须要注明它的确切类型，例如以下代码，我们允许时它会抛出一个错误：</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> num</span><span style="color:#000000"> = </span><span style="color:#A31515">"42"</span><span style="color:#000000">.</span><span style="color:#795E26">trim</span><span style="color:#000000">().</span><span style="color:#795E26">parse</span><span style="color:#000000">().</span><span style="color:#795E26">expect</span><span style="color:#000000">(</span><span style="color:#A31515">"type conversion error"</span><span style="color:#000000">);</span></span></code></pre>

      <p>它表明编译器需要我们提供更多信息来确定 <code>num</code> 到底是什么类型</p>
      <pre className="shiki light-plus language-shell" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="SHELL"><code><span className="line"><span style="color:#008000"># clover @ MacBook-Pro in ~/dev/rust/learn/datatype on git:master x [16:48:03] C:101</span></span>
        <span className="line"><span style="color:#795E26">$</span><span style="color:#A31515"> cargo</span><span style="color:#A31515"> run</span></span>
        <span className="line"><span style="color:#795E26">   Compiling</span><span style="color:#A31515"> datatype</span><span style="color:#A31515"> v0.1.0</span><span style="color:#000000"> (/Users/clover/dev/rust/learn/datatype)</span></span>
        <span className="line"><span style="color:#795E26">error[E0282]:</span><span style="color:#A31515"> type</span><span style="color:#A31515"> annotations</span><span style="color:#A31515"> needed</span></span>
        <span className="line"><span style="color:#795E26"> --&gt;</span><span style="color:#A31515"> src/main.rs:3:9</span></span>
        <span className="line"><span style="color:#000000">  |</span></span>
        <span className="line"><span style="color:#795E26">3</span><span style="color:#000000"> |     </span><span style="color:#795E26">let</span><span style="color:#A31515"> num</span><span style="color:#A31515"> =</span><span style="color:#A31515"> "42".trim</span><span style="color:#000000">()</span><span style="color:#A31515">.parse</span><span style="color:#000000">()</span><span style="color:#A31515">.expect</span><span style="color:#000000">(</span><span style="color:#795E26">"type conversion error"</span><span style="color:#000000">);</span></span>
        <span className="line"><span style="color:#000000">  |         </span><span style="color:#795E26">^^^</span></span>
        <span className="line"><span style="color:#000000">  |</span></span>
        <span className="line"><span style="color:#795E26">help:</span><span style="color:#A31515"> consider</span><span style="color:#A31515"> giving</span><span style="color:#A31515"> `</span><span style="color:#795E26">num</span><span style="color:#A31515">`</span><span style="color:#795E26"> an</span><span style="color:#A31515"> explicit</span><span style="color:#A31515"> type</span></span>
        <span className="line"><span style="color:#000000">  |</span></span>
        <span className="line"><span style="color:#795E26">3</span><span style="color:#000000"> |     </span><span style="color:#795E26">let</span><span style="color:#A31515"> num:</span><span style="color:#A31515"> /</span><span style="color:#0000FF">*</span><span style="color:#A31515"> Type</span><span style="color:#0000FF"> *</span><span style="color:#A31515">/</span><span style="color:#A31515"> =</span><span style="color:#A31515"> "42".trim</span><span style="color:#000000">()</span><span style="color:#A31515">.parse</span><span style="color:#000000">()</span><span style="color:#A31515">.expect</span><span style="color:#000000">(</span><span style="color:#795E26">"type conversion error"</span><span style="color:#000000">);</span></span>
        <span className="line"><span style="color:#000000">  |            </span><span style="color:#795E26">++++++++++++</span></span>
        <span className="line"></span>
        <span className="line"><span style="color:#795E26">For</span><span style="color:#A31515"> more</span><span style="color:#A31515"> information</span><span style="color:#A31515"> about</span><span style="color:#A31515"> this</span><span style="color:#A31515"> error,</span><span style="color:#A31515"> try</span><span style="color:#A31515"> `</span><span style="color:#795E26">rustc</span><span style="color:#0000FF"> --explain</span><span style="color:#A31515"> E0282`</span><span style="color:#795E26">.</span></span>
        <span className="line"><span style="color:#795E26">error:</span><span style="color:#A31515"> could</span><span style="color:#A31515"> not</span><span style="color:#A31515"> compile</span><span style="color:#A31515"> `</span><span style="color:#795E26">datatype</span><span style="color:#A31515">`</span><span style="color:#795E26"> due</span><span style="color:#A31515"> to</span><span style="color:#A31515"> previous</span><span style="color:#A31515"> error</span></span>
        <span className="line"></span>
        <span className="line"></span></code></pre>

      <p>正确做法应该是这样：</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> num</span><span style="color:#000000">: </span><span style="color:#267F99">i8</span><span style="color:#000000"> = </span><span style="color:#A31515">"42"</span><span style="color:#000000">.</span><span style="color:#795E26">trim</span><span style="color:#000000">().</span><span style="color:#795E26">parse</span><span style="color:#000000">().</span><span style="color:#795E26">expect</span><span style="color:#000000">(</span><span style="color:#A31515">"type conversion error"</span><span style="color:#000000">);</span></span></code></pre>

      <h2 id="表量类型"><a href="#表量类型" className="headerlink" title="表量类型"></a>表量类型</h2><p>表量(Scalar)类型表示单个值。Rust 中有四个基本的表量类型：整形、浮点、布尔和字符</p>
      <h3 id="整数类型"><a href="#整数类型" className="headerlink" title="整数类型"></a>整数类型</h3><p>整数是没有小数部分的数字，例如 <code>u32</code> 。吃类型声明表明它的值应该是占 32 位空间的无符号整型（有符号整形以 <code>i</code> 开始，i 是英文单词 integer 的首字母。与之相反的是 <code>u</code> ，代表无符号 <code>unsigned</code> 类型）。我们可以使用这样定义形式中的任何一个来声明整数值的类型。</p>
      <table>
        <thead>
          <tr>
            <th>长度</th>
            <th>有符号类型</th>
            <th>无符号类型</th>
          </tr>
        </thead>
        <tbody><tr>
          <td>8</td>
          <td><code>i8</code></td>
          <td><code>u8</code></td>
        </tr>
          <tr>
            <td>16</td>
            <td><code>i16</code></td>
            <td><code>u16</code></td>
          </tr>
          <tr>
            <td>32</td>
            <td><code>i32</code></td>
            <td><code>u32</code></td>
          </tr>
          <tr>
            <td>64</td>
            <td><code>i64</code></td>
            <td><code>u64</code></td>
          </tr>
          <tr>
            <td>128</td>
            <td><code>i128</code></td>
            <td><code>u128</code></td>
          </tr>
          <tr>
            <td>arch</td>
            <td><code>isize</code></td>
            <td><code>usize</code></td>
          </tr>
        </tbody></table>
      <blockquote>
        <p>每个定义形式要么是有符号类型要么是无符号类型，且带有一个显式的大小。<strong>有符号</strong>和<strong>无符号</strong>表示数字能否取负数——也就是说，这个数是否可能是负数（有符号类型），或一直为正而不需要带上符号（无符号类型）。就像在纸上写数字一样：当要强调符号时，数字前面可以带上正号或负号；然而，当很明显确定数字为正数时，就不需要加上正号了。有符号数字以<a href="https://en.wikipedia.org/wiki/Two's_complement">二进制补码</a>（译者补充：<a href="https://baike.baidu.com/item/%E8%A1%A5%E7%A0%81/6854613">“补码”百度百科</a>）形式存储。</p>
        <p>每个有符号类型规定的数字范围是 -(2n - 1) ~ 2n - 1 - 1，其中 <code>n</code> 是该定义形式的位长度。所以 <code>i8</code> 可存储数字范围是 -(27) ~ 27 - 1，即 -128 ~ 127。无符号类型可以存储的数字范围是 0 ~ 2n - 1，所以 <code>u8</code> 能够存储的数字为 0 ~ 28 - 1，即 0 ~ 255。</p>
        <p>此外，<code>isize</code> 和 <code>usize</code> 类型取决于程序运行的计算机体系结构，在表中表示为“arch”：若使用 64 位架构系统则为 64 位，若使用 32 位架构系统则为 32 位。</p>
        <p>你可按表 3-2 中所示的任意形式来编写整型的字面量。注意，可能属于多种数字类型的数字字面量允许使用类型后缀来指定类型，例如 <code>57u8</code>。数字字面量还可以使用 <code>_</code> 作为可视分隔符以方便读数，如 <code>1_000</code>，此值和 <code>1000</code> 相同。</p>
      </blockquote>
      <p>(我目前对这个不太懂，我就直接摘过来了)</p>
      <table>
        <thead>
          <tr>
            <th>数字字面量</th>
            <th>实例</th>
          </tr>
        </thead>
        <tbody><tr>
          <td>十进制</td>
          <td>98_222</td>
        </tr>
          <tr>
            <td>十六进制</td>
            <td>0xff</td>
          </tr>
          <tr>
            <td>八进制</td>
            <td>0o77</td>
          </tr>
          <tr>
            <td>二进制</td>
            <td>0b1111_0000</td>
          </tr>
          <tr>
            <td>字节（仅限于<code>u8</code>）</td>
            <td>b’A’</td>
          </tr>
        </tbody></table>
      <p>如果我们不确定自己需要使用哪一种类型的整形，那么就使用 <code>i32</code> ，同时这也是 Rust 默认的类型。<code>isize</code> 和 <code>usize</code> 一般用作某些集合的索引。</p>
      <blockquote>
        <h4 id="整型溢出"><a href="#整型溢出" className="headerlink" title="整型溢出"></a>整型溢出</h4><p>比方说有一个 <code>u8</code> ，它可以存放从 0 到 255 的值。那么当你将其修改为范围之外的值，比如 256，则会发生<strong>整型溢出</strong>（_integer overflow_），这会导致两种行为的其中一种。当在调试（debug）模式编译时，Rust 会检查整型溢出，若存在这些问题则使程序在编译时 _panic_。Rust 使用 panic 这个术语来表明程序因错误而退出。第 9 章 <a href="https://rustwiki.org/zh-CN/book/ch09-01-unrecoverable-errors-with-panic.html">“<code>panic!</code> 与不可恢复的错误”</a>会详细介绍 panic。</p>
        <p>在当使用 <code>--release</code> 参数进行发布（release）模式构建时，Rust <strong>不</strong>检测会导致 panic 的整型溢出。相反当检测到整型溢出时，Rust 会进行一种被称为二进制补码包裹（_two’s complement wrapping_）的操作。简而言之，大于该类型最大值的数值会被“包裹”成该类型能够支持的对应数字的最小值。比如在 <code>u8</code> 的情况下，256 变成 0，257 变成 1，依此类推。程序不会 panic，但是该变量的值可能不是你期望的值。依赖整型溢出包裹的行为不是一种正确的做法。</p>
        <p>要显式处理溢出的可能性，可以使用标准库针对原始数字类型提供的以下一系列方法：</p>
        <ul>
          <li>使用 <code>wrapping_*</code> 方法在所有模式下进行包裹，例如 <code>wrapping_add</code></li>
          <li>如果使用 <code>checked_*</code> 方法时发生溢出，则返回 <code>None</code> 值</li>
          <li>使用 <code>overflowing_*</code> 方法返回该值和一个指示是否存在溢出的布尔值</li>
          <li>使用 <code>saturating_*</code> 方法使值达到最小值或最大值</li>
        </ul>
      </blockquote>
      <h3 id="浮点数"><a href="#浮点数" className="headerlink" title="浮点数"></a>浮点数</h3><p>浮点数是带有小数点的数字，在 Rust 中，浮点类型数字有两种基本类型。Rust 的浮点型是 <code>f32</code> 和 <code>f64</code> ，它们的大小分别为 32 位和 64 位。默认的浮点类型是 <code>f64</code> ，因为在现代 CPU 中它的速度与 <code>f32</code> 几乎相同，但精度更高。所有的浮点类型都是有符号的。</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#008000">// 浮点数</span></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> a</span><span style="color:#000000"> = </span><span style="color:#098658">1.0</span><span style="color:#000000">; </span><span style="color:#008000">// f64</span></span>
        <span className="line"></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> b</span><span style="color:#000000">: </span><span style="color:#267F99">f32</span><span style="color:#000000"> = </span><span style="color:#098658">2.0</span><span style="color:#000000">; </span><span style="color:#008000">// f32</span></span></code></pre>

      <blockquote>
        <p>浮点数按照 IEEE-754 标准表示。<code>f32</code> 类型是单精度浮点型，<code>f64</code> 为双精度浮点型。</p>
      </blockquote>
      <h3 id="布尔类型"><a href="#布尔类型" className="headerlink" title="布尔类型"></a>布尔类型</h3><p>布尔类型只有两种值：<code>true</code> 和 <code>false</code> 。通常用在 <code>if</code> 条件判断上，布尔值的大小为 1 个字节</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> _true</span><span style="color:#000000">: </span><span style="color:#267F99">bool</span><span style="color:#000000"> = </span><span style="color:#0000FF">true</span><span style="color:#000000">;</span></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> _false</span><span style="color:#000000">: </span><span style="color:#267F99">bool</span><span style="color:#000000"> = </span><span style="color:#0000FF">false</span><span style="color:#000000">;</span></span></code></pre>

      <h3 id="字符类型"><a href="#字符类型" className="headerlink" title="字符类型"></a>字符类型</h3><p>Rust 的 <code>char</code> （字符）类型是最基本的字母类型</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> _char</span><span style="color:#000000">: </span><span style="color:#267F99">char</span><span style="color:#000000"> = </span><span style="color:#A31515">'A'</span><span style="color:#000000">;</span></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> _char</span><span style="color:#000000">: </span><span style="color:#267F99">char</span><span style="color:#000000"> = </span><span style="color:#A31515">'嗨'</span><span style="color:#000000">;</span></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> _char</span><span style="color:#000000">: </span><span style="color:#267F99">char</span><span style="color:#000000"> = </span><span style="color:#A31515">'👋'</span><span style="color:#000000">;</span></span></code></pre>

      <p>字符和字符串不同的是，字符字面量需要使用但引号括起来，而字符串是双引号。Rust 的字符类型大小为 4 个字节，表示的是一个 Unicode 标量值。这意味着它可以表示的远远不止是 ASCII。标音字母，中文/日文/韩文的文字，emoji，还有零宽空格(zero width space)在 Rust 中都是合法的字符类型。</p>
      <p>Unicode 值的范围为 <code>U+0000~U+D7FF</code> 和 <code>U+E000</code>~`U+10FFFF` 。字符并不是 Unicode 中的一个概念，所以人在直觉上对字符的理解和 Rust 的概念不一致。</p>
      <h2 id="复合类型"><a href="#复合类型" className="headerlink" title="复合类型"></a>复合类型</h2><p>组合类型可以将多个值组合成一个类型。Rust 有两种基本的复合类型：元组（tuple）、数组（Array）</p>
      <h3 id="元组类型"><a href="#元组类型" className="headerlink" title="元组类型"></a>元组类型</h3><p>元组是将多个不同类型的值组合到一个复合类型中的一种基本方式，元组的长度是固定的，无法再重新增加或缩小。</p>
      <p>在 Rust 中通过在小括号内写入以逗号分隔的值列表来创建一个元组。元组中的每一个位置都有一个类型，并且元组中不同值的类型不要求是相同的（文档这句话有些绕不好理解，说白就是一个元组中每一个值的类型都不要求相同。只需要和当前索引在元组类型定义中的类型相同即可，例如 2 号位是 <code>i32</code> 那么实际值的 2 号位只能是 <code>i32</code>）</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> tuple</span><span style="color:#000000">: (</span><span style="color:#267F99">i32</span><span style="color:#000000">, &amp;</span><span style="color:#267F99">str</span><span style="color:#000000">, </span><span style="color:#267F99">bool</span><span style="color:#000000">) = (</span><span style="color:#098658">1</span><span style="color:#000000">, </span><span style="color:#A31515">"hi"</span><span style="color:#000000">, </span><span style="color:#0000FF">false</span><span style="color:#000000">);</span></span></code></pre>

      <p>如果实际值的类型与定义的类型不同，那么编译器会抛出错误。</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> tuple</span><span style="color:#000000">: (</span><span style="color:#267F99">i32</span><span style="color:#000000">, &amp;</span><span style="color:#267F99">str</span><span style="color:#000000">, </span><span style="color:#267F99">bool</span><span style="color:#000000">) = (</span><span style="color:#0000FF">true</span><span style="color:#000000">, </span><span style="color:#A31515">"hi"</span><span style="color:#000000">, </span><span style="color:#0000FF">false</span><span style="color:#000000">);</span></span></code></pre>

      <p>在类型定义中是 <code>i32</code> ，但实际得到一个布尔：</p>
      <pre className="shiki light-plus language-shell" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="SHELL"><code><span className="line"><span style="color:#008000"># clover @ MacBook-Pro in ~/dev/rust/learn/datatype on git:master x [18:11:19]</span></span>
        <span className="line"><span style="color:#795E26">$</span><span style="color:#A31515"> cargo</span><span style="color:#A31515"> build</span></span>
        <span className="line"><span style="color:#795E26">   Compiling</span><span style="color:#A31515"> datatype</span><span style="color:#A31515"> v0.1.0</span><span style="color:#000000"> (/Users/clover/dev/rust/learn/datatype)</span></span>
        <span className="line"><span style="color:#795E26">error[E0308]:</span><span style="color:#A31515"> mismatched</span><span style="color:#A31515"> types</span></span>
        <span className="line"><span style="color:#795E26">  --&gt;</span><span style="color:#A31515"> src/main.rs:44:37</span></span>
        <span className="line"><span style="color:#000000">   |</span></span>
        <span className="line"><span style="color:#795E26">44</span><span style="color:#000000"> |     </span><span style="color:#795E26">let</span><span style="color:#A31515"> tuple:</span><span style="color:#000000"> (i32, &amp;</span><span style="color:#795E26">str,</span><span style="color:#A31515"> bool</span><span style="color:#000000">) = (</span><span style="color:#795E26">true</span><span style="color:#000000">, </span><span style="color:#A31515">"hi",</span><span style="color:#0000FF"> false</span><span style="color:#000000">);</span></span>
        <span className="line"><span style="color:#000000">   |                                     </span><span style="color:#795E26">^^^^</span><span style="color:#A31515"> expected</span><span style="color:#A31515"> `</span><span style="color:#795E26">i32</span><span style="color:#A31515">`</span><span style="color:#795E26">,</span><span style="color:#A31515"> found</span><span style="color:#A31515"> `</span><span style="color:#795E26">bool</span><span style="color:#A31515">`</span></span>
        <span className="line"></span>
        <span className="line"><span style="color:#795E26">For</span><span style="color:#A31515"> more</span><span style="color:#A31515"> information</span><span style="color:#A31515"> about</span><span style="color:#A31515"> this</span><span style="color:#A31515"> error,</span><span style="color:#A31515"> try</span><span style="color:#A31515"> `</span><span style="color:#795E26">rustc</span><span style="color:#0000FF"> --explain</span><span style="color:#A31515"> E0308`</span><span style="color:#795E26">.</span></span>
        <span className="line"><span style="color:#795E26">error:</span><span style="color:#A31515"> could</span><span style="color:#A31515"> not</span><span style="color:#A31515"> compile</span><span style="color:#A31515"> `</span><span style="color:#795E26">datatype</span><span style="color:#A31515">`</span><span style="color:#795E26"> due</span><span style="color:#A31515"> to</span><span style="color:#A31515"> previous</span><span style="color:#A31515"> error</span></span></code></pre>

      <p>如果我们需要提取元组的值，我们可以通过模式匹配来解构元组的值：</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> tuple</span><span style="color:#000000">: (</span><span style="color:#267F99">i32</span><span style="color:#000000">, &amp;</span><span style="color:#267F99">str</span><span style="color:#000000">, </span><span style="color:#267F99">bool</span><span style="color:#000000">) = (</span><span style="color:#098658">1</span><span style="color:#000000">, </span><span style="color:#A31515">"hi"</span><span style="color:#000000">, </span><span style="color:#0000FF">false</span><span style="color:#000000">);</span></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#000000"> (</span><span style="color:#001080">num</span><span style="color:#000000">, </span><span style="color:#001080">halo</span><span style="color:#000000">, </span><span style="color:#001080">boolean</span><span style="color:#000000">) = </span><span style="color:#001080">tuple</span><span style="color:#000000">;</span></span>
        <span className="line"><span style="color:#795E26">println!</span><span style="color:#000000">(</span><span style="color:#A31515">"num { } halo { } bool { }"</span><span style="color:#000000">, </span><span style="color:#001080">num</span><span style="color:#000000">, </span><span style="color:#001080">halo</span><span style="color:#000000">, </span><span style="color:#001080">boolean</span><span style="color:#000000">)</span></span></code></pre>

      <pre className="shiki light-plus language-shell" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="SHELL"><code><span className="line"><span style="color:#008000"># clover @ MacBook-Pro in ~/dev/rust/learn/datatype on git:master x [18:15:18]</span></span>
        <span className="line"><span style="color:#795E26">$</span><span style="color:#A31515"> cargo</span><span style="color:#A31515"> run</span></span>
        <span className="line"><span style="color:#795E26">    Finished</span><span style="color:#A31515"> dev</span><span style="color:#000000"> [unoptimized </span><span style="color:#A31515">+</span><span style="color:#A31515"> debuginfo]</span><span style="color:#A31515"> target</span><span style="color:#000000">(</span><span style="color:#795E26">s</span><span style="color:#000000">) </span><span style="color:#A31515">in</span><span style="color:#098658"> 0.00</span><span style="color:#A31515">s</span></span>
        <span className="line"><span style="color:#795E26">     Running</span><span style="color:#A31515"> `</span><span style="color:#795E26">target/debug/datatype</span><span style="color:#A31515">`</span></span>
        <span className="line"><span style="color:#795E26">num</span><span style="color:#098658"> 1</span><span style="color:#A31515"> halo</span><span style="color:#A31515"> hi</span><span style="color:#A31515"> bool</span><span style="color:#0000FF"> false</span></span></code></pre>

      <p>除了使用解构来获取元组的值外，还可以使用 <code>.</code> 连上需要访问的值的索引来直接访问元组元素，这种方式比较灵活：</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> tuple</span><span style="color:#000000">: (</span><span style="color:#267F99">i32</span><span style="color:#000000">, &amp;</span><span style="color:#267F99">str</span><span style="color:#000000">, </span><span style="color:#267F99">bool</span><span style="color:#000000">) = (</span><span style="color:#098658">1</span><span style="color:#000000">, </span><span style="color:#A31515">"hi"</span><span style="color:#000000">, </span><span style="color:#0000FF">false</span><span style="color:#000000">);</span></span>
        <span className="line"><span style="color:#795E26">println!</span><span style="color:#000000">(</span><span style="color:#A31515">"num { } halo { } bool { }"</span><span style="color:#000000">, </span><span style="color:#001080">tuple</span><span style="color:#000000">.</span><span style="color:#098658">0</span><span style="color:#000000">, </span><span style="color:#001080">tuple</span><span style="color:#000000">.</span><span style="color:#098658">1</span><span style="color:#000000">, </span><span style="color:#001080">tuple</span><span style="color:#000000">.</span><span style="color:#098658">2</span><span style="color:#000000">);</span></span></code></pre>

      <p>和大多数编程语言一样，元组中的第一个元素索引为 0</p>
      <pre className="shiki light-plus language-shell" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="SHELL"><code><span className="line"><span style="color:#008000"># clover @ MacBook-Pro in ~/dev/rust/learn/datatype on git:master x [16:04:01]</span></span>
        <span className="line"><span style="color:#795E26">$</span><span style="color:#A31515"> cargo</span><span style="color:#A31515"> run</span></span>
        <span className="line"><span style="color:#795E26">   Compiling</span><span style="color:#A31515"> datatype</span><span style="color:#A31515"> v0.1.0</span><span style="color:#000000"> (/Users/clover/dev/rust/learn/datatype)</span></span>
        <span className="line"><span style="color:#795E26">    Finished</span><span style="color:#A31515"> dev</span><span style="color:#000000"> [unoptimized </span><span style="color:#A31515">+</span><span style="color:#A31515"> debuginfo]</span><span style="color:#A31515"> target</span><span style="color:#000000">(</span><span style="color:#795E26">s</span><span style="color:#000000">) </span><span style="color:#A31515">in</span><span style="color:#098658"> 0.28</span><span style="color:#A31515">s</span></span>
        <span className="line"><span style="color:#795E26">     Running</span><span style="color:#A31515"> `</span><span style="color:#795E26">target/debug/datatype</span><span style="color:#A31515">`</span></span>
        <span className="line"><span style="color:#795E26">num</span><span style="color:#098658"> 1</span><span style="color:#A31515"> halo</span><span style="color:#A31515"> hi</span><span style="color:#A31515"> bool</span><span style="color:#0000FF"> false</span></span></code></pre>

      <blockquote>
        <p>没有任何值的元组 <code>()</code> 是一种特殊的类型，只有一个值，也写成 <code>()</code>。该类型被称为<strong>单元类型</strong>（_unit type_），该值被称为<strong>单元值</strong>（_unit value_）。如果表达式不返回任何其他值，就隐式地返回单元值。</p>
      </blockquote>
      <h3 id="数组类型"><a href="#数组类型" className="headerlink" title="数组类型"></a>数组类型</h3><p>将多个值组合在一起的另外一种方式就是使用数组，与元组不同的是，数组的每一个元素都必须具有相同的类型。和其它语言不同的是，Rust 中的数组具有固定长度。</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> arr</span><span style="color:#000000"> = [</span><span style="color:#098658">1</span><span style="color:#000000">, </span><span style="color:#098658">2</span><span style="color:#000000">, </span><span style="color:#098658">3</span><span style="color:#000000">, </span><span style="color:#098658">4</span><span style="color:#000000">, </span><span style="color:#098658">5</span><span style="color:#000000">];</span></span></code></pre>

      <p>当你希望将数据分配到栈(stack)而不是堆(heap)时或者你希望始终保存最终具有固定数量的元素时就可以使用数组。但他们不想 vector(向量)那么灵活，vector 类似标准库提供的集合类型，它允许你增长或缩小大小。如果不确定需要使用数组还是 vector，那就应该使用 vector (这是因为你的长度是可变的才会纠结)</p>
      <p>数组的类型使用中括号编写，其中需要包含数组的类型、分号、数量</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> arr</span><span style="color:#000000">:[</span><span style="color:#267F99">i32</span><span style="color:#000000">; </span><span style="color:#098658">5</span><span style="color:#000000">] = [</span><span style="color:#098658">1</span><span style="color:#000000">, </span><span style="color:#098658">2</span><span style="color:#000000">, </span><span style="color:#098658">3</span><span style="color:#000000">, </span><span style="color:#098658">4</span><span style="color:#000000">, </span><span style="color:#098658">5</span><span style="color:#000000">];</span></span></code></pre>

      <p>以上代码 <code>i32</code> 是表示数组元素的类型，分号后面的 5 表示这个数组有 5 位。但是这种方式需要每一个元素中都有一个初始值，有些时候不太好用。咱们可以使用下面这种方式创建数组，它可以自动初始化。</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> arr</span><span style="color:#000000"> = [</span><span style="color:#098658">3</span><span style="color:#000000">; </span><span style="color:#098658">5</span><span style="color:#000000">];</span></span></code></pre>

      <p>以上代码创建一个数组，数组中 3 表示这个数组的初始值是 3，然后有 5 个元素。在运行的时候会自动创建 <code>[3, 3, 3, 3, 3]</code> 。</p>
      <p>数组是可以在栈内存上分配的已知固定大小的单个内存块。可以使用索引来访问数组的元素。</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> arr</span><span style="color:#000000"> = [</span><span style="color:#098658">1</span><span style="color:#000000">, </span><span style="color:#098658">2</span><span style="color:#000000">, </span><span style="color:#098658">3</span><span style="color:#000000">, </span><span style="color:#098658">4</span><span style="color:#000000">, </span><span style="color:#098658">5</span><span style="color:#000000">];</span></span>
        <span className="line"><span style="color:#795E26">println!</span><span style="color:#000000">(</span><span style="color:#A31515">"first { } two { }"</span><span style="color:#000000">, </span><span style="color:#001080">arr</span><span style="color:#000000">[</span><span style="color:#098658">0</span><span style="color:#000000">], </span><span style="color:#001080">arr</span><span style="color:#000000">[</span><span style="color:#098658">1</span><span style="color:#000000">]);</span></span></code></pre>

      <pre className="shiki light-plus language-shell" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="SHELL"><code><span className="line"><span style="color:#008000"># clover @ MacBook-Pro in ~/dev/rust/learn/datatype on git:master x [9:39:12] C:101</span></span>
        <span className="line"><span style="color:#795E26">$</span><span style="color:#A31515"> cargo</span><span style="color:#A31515"> run</span></span>
        <span className="line"><span style="color:#795E26">$</span><span style="color:#A31515"> cargo</span><span style="color:#A31515"> run</span></span>
        <span className="line"><span style="color:#795E26">   Compiling</span><span style="color:#A31515"> datatype</span><span style="color:#A31515"> v0.1.0</span><span style="color:#000000"> (/Users/clover/dev/rust/learn/datatype)</span></span>
        <span className="line"><span style="color:#795E26">    Finished</span><span style="color:#A31515"> dev</span><span style="color:#000000"> [unoptimized </span><span style="color:#A31515">+</span><span style="color:#A31515"> debuginfo]</span><span style="color:#A31515"> target</span><span style="color:#000000">(</span><span style="color:#795E26">s</span><span style="color:#000000">) </span><span style="color:#A31515">in</span><span style="color:#098658"> 0.43</span><span style="color:#A31515">s</span></span>
        <span className="line"><span style="color:#795E26">     Running</span><span style="color:#A31515"> `</span><span style="color:#795E26">target/debug/datatype</span><span style="color:#A31515">`</span></span>
        <span className="line"><span style="color:#795E26">first</span><span style="color:#098658"> 1</span><span style="color:#A31515"> two</span><span style="color:#098658"> 2</span></span></code></pre>

      <p>尝试访问超出数组末尾的元素：</p>
      <pre className="shiki light-plus language-rust" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="RUST"><code><span className="line"><span style="color:#0000FF">let</span><span style="color:#0000FF"> mut</span><span style="color:#001080"> inp</span><span style="color:#000000"> = </span><span style="color:#267F99">String</span><span style="color:#000000">::</span><span style="color:#795E26">new</span><span style="color:#000000">();</span></span>
        <span className="line"><span style="color:#267F99">io</span><span style="color:#000000">::</span><span style="color:#795E26">stdin</span><span style="color:#000000">().</span><span style="color:#795E26">read_line</span><span style="color:#000000">(&amp;</span><span style="color:#0000FF">mut</span><span style="color:#001080"> inp</span><span style="color:#000000">).</span><span style="color:#795E26">expect</span><span style="color:#000000">(</span><span style="color:#A31515">"faild to read"</span><span style="color:#000000">);</span></span>
        <span className="line"></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> index</span><span style="color:#000000">: </span><span style="color:#267F99">usize</span><span style="color:#000000"> = </span><span style="color:#001080">inp</span><span style="color:#000000">.</span><span style="color:#795E26">trim</span><span style="color:#000000">().</span><span style="color:#795E26">parse</span><span style="color:#000000">().</span><span style="color:#795E26">expect</span><span style="color:#000000">(</span><span style="color:#A31515">"fiald to parse"</span><span style="color:#000000">);</span></span>
        <span className="line"><span style="color:#0000FF">let</span><span style="color:#001080"> target</span><span style="color:#000000"> = </span><span style="color:#001080">arr</span><span style="color:#000000">[</span><span style="color:#001080">index</span><span style="color:#000000">];</span></span>
        <span className="line"></span>
        <span className="line"><span style="color:#795E26">println!</span><span style="color:#000000">(</span><span style="color:#A31515">"target { }"</span><span style="color:#000000">, </span><span style="color:#001080">target</span><span style="color:#000000">);</span></span></code></pre>

      <pre className="shiki light-plus language-shell" style="background-color:#FFFFFF;color:#000000" tabindex="0" data-language="SHELL"><code><span className="line"><span style="color:#008000"># clover @ MacBook-Pro in ~/dev/rust/learn/datatype on git:master x [9:47:54]</span></span>
        <span className="line"><span style="color:#795E26">$</span><span style="color:#A31515"> cargo</span><span style="color:#A31515"> run</span></span>
        <span className="line"><span style="color:#795E26">    Finished</span><span style="color:#A31515"> dev</span><span style="color:#000000"> [unoptimized </span><span style="color:#A31515">+</span><span style="color:#A31515"> debuginfo]</span><span style="color:#A31515"> target</span><span style="color:#000000">(</span><span style="color:#795E26">s</span><span style="color:#000000">) </span><span style="color:#A31515">in</span><span style="color:#098658"> 0.00</span><span style="color:#A31515">s</span></span>
        <span className="line"><span style="color:#795E26">     Running</span><span style="color:#A31515"> `</span><span style="color:#795E26">target/debug/datatype</span><span style="color:#A31515">`</span></span>
        <span className="line"><span style="color:#795E26">6</span></span>
        <span className="line"><span style="color:#795E26">thread</span><span style="color:#A31515"> 'main'</span><span style="color:#A31515"> panicked</span><span style="color:#A31515"> at</span><span style="color:#A31515"> 'index out of bounds: the len is 5 but the index is 6',</span><span style="color:#A31515"> src/main.rs:55:18</span></span>
        <span className="line"><span style="color:#795E26">note:</span><span style="color:#A31515"> run</span><span style="color:#A31515"> with</span><span style="color:#A31515"> `</span><span style="color:#001080">RUST_BACKTRACE</span><span style="color:#000000">=</span><span style="color:#098658">1</span><span style="color:#A31515">` </span><span style="color:#795E26">environment</span><span style="color:#A31515"> variable to display a backtrace</span></span></code></pre>

      <p>该程序在索引操作中使用无效值时导致<strong>运行时</strong>错误，程序退出并显示错误消息，未执行后面的代码。当你尝试使用索引访问元素的时候，Rust 将检查你指定的索引是否小于数组长度。如果索引大于或等于数组长度，Rust 会出现 <code>panic</code> 。这种检查必须在运行时进行，尤其是咋这种情况下，因为编译器可能无法知道用户之后运行代码时将输入什么值。</p>
      <p>这是 Rust 在实践中安全原则的第一个例子。很多低级语言中，并不进行这种检查，而且在你使用不正确的索引时，可以访问无效的内存。Rust 通过立即退出的方式来防止这种错误，而不是允许访问并继续运行程序。</p>
    </div>
  </>
}