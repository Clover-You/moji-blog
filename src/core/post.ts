import process from 'node:process'
import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'

const IsPro = process.env.NODE_ENV === 'production'
const IsDev = process.env.NODE_ENV === 'development'

async function getMarkdownFiles(path: string) {
  const files = await fg(path)

  return files.filter((it) => {
    if (!IsPro)
      return true
    return !it.endsWith('.dev.md')
  })
}

let __POSTS: PostFrontmatter[]

export async function getPostList() {
  if (!IsDev && __POSTS)
    return __POSTS

  const files = await getMarkdownFiles('pages/posts/*.md')

  const posts = await Promise.all(files.map<Promise<PostFrontmatter>>(async (file) => {
    const raw = await fs.readFile(file, 'utf-8')
    const { data } = matter(raw)

    const [_, fileFullPath] = file.match(/pages\/posts\/(.*)\.md$/) ?? []
    const fileNameAlias = fileFullPath.replaceAll('/', '-')

    return {
      ...data,
      date: new Date(data.date),
      pid: data.pid,
      content: '',
      author: ['Clover'],
      categories: data.categories?.split(',') ?? [],
      more: '',
      slug: fileNameAlias,
      tags: data.tags?.split(',') ?? [],
      title: data.title,
      cover: data.cover,
    }
  }))

  posts.sort((a, b) => +new Date(b?.date ?? 0) - +new Date(a?.date ?? 0))

  __POSTS = posts

  return posts
}

let __POSTS_MAP: Record<string, PostFrontmatter>
export async function getPostRouteMap() {
  if (!IsDev && __POSTS_MAP)
    return __POSTS_MAP

  const posts = await getPostList()
  const postsMap = posts.reduce<Record<string, PostFrontmatter>>((acc, cuur) => {
    acc[cuur.slug] = cuur
    return acc
  }, {})

  __POSTS_MAP = postsMap

  return postsMap
}

export async function getPostBySlug(slug: string) {
  const posts = await getPostRouteMap()
  if (!posts)
    return

  return posts[slug]
}

export async function getSlugs() {
  const posts = await getPostList()
  return posts.map(it => it.slug)
}

let __CATEGORIES: string[]
export async function getAllCategories() {
  if (!IsDev && __CATEGORIES)
    return __CATEGORIES

  const posts = await getPostList()
  return __CATEGORIES = posts.reduce((acc, { categories = [] }) => {
    acc.push(...categories.map(str => str.trim()))
    return acc
  }, [] as string[])
}

export async function getCateforieTotal() {
  const categories = await getAllCategories()
  return categories.length
}

async function getPages() {
  const files = await getMarkdownFiles('pages/*.md')

  return await Promise.all(files.map(async (file) => {
    const raw = await fs.readFile(file, 'utf-8')
    const { data } = matter(raw)

    const [_, fileFullPath] = file.match(/pages\/(.*)\.md/) ?? []
    const fileNameAlias = fileFullPath.replaceAll('/', '-')

    return {
      page: fileNameAlias,
      meta: data,
    }
  }))
}

let __PAGE_MAP: Record<string, { content: string, meta: any, page: string }>
export async function getPageMap() {
  if (!IsDev && __PAGE_MAP)
    return __PAGE_MAP

  const pages = await getPages()

  return __PAGE_MAP = pages.reduce((acc, curr) => {
    acc[curr.page] = curr
    return acc
  }, {} as Record<string, any>)
}

export async function getPageByName(name: string) {
  const pages = await getPageMap()
  return pages[name]
}
