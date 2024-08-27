declare module '*.md' {
  export const MarkdownComponent: () => JSX.Element

  export default MarkdownComponent

  export const forntmatter: {
    /**
     * The title of the markdown
     */
    title: string
    /**
     * The tags of the post
     */
    tags?: string[] | string
    /**
     * The language of the post
     */
    lang?: string
    /**
     * The date of the post first compiled
     */
    date?: string
    /**
     * The categories of the post
     */
    caregoties?: string[] | string
    /**
     * Post id
     */
    pid: string
    /**
     * The last edit time
     */
    lastEdit?: string
    /**
     * Estimated reading time
     */
    duration?: string
    /**
     * Post write author or translate author
     */
    author?: string
  }
}
