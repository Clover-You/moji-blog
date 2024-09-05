interface PostFrontmatter {
  /**
   * 文章ID
   */
  pid: string
  /**
   * 标题
   */
  title: string
  /**
   * 内容
   * @deprecated
   */
  content: string
  /**
   * 日期
   */
  date: Date
  /**
   * 路径
   */
  slug: string
  /**
   * 标签
   */
  tags: string[]
  /**
   * 分类
   */
  categories: string[]
  /**
   * 文章摘要
   */
  more: string
  /**
   * 封面
   */
  cover?: string
  /**
   * 作者
   */
  author: string[]
  /**
   * 阅读时长
   */
  duration?: string
  /**
   * page description
   */
  description?: string
  draft?: boolean
  [key: string]: any
}
