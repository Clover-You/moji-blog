declare module '*.md' {
  export const MarkdownComponent: () => JSX.Element

  export default MarkdownComponent

  export const frontmatter: PostFrontmatter
}
