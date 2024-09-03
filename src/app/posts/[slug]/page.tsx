import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fg from 'fast-glob'
import fs from 'fs-extra'
import toml from 'toml'

import dayjs from 'dayjs'
import { getPostBySlug, getSlugs } from '#/core/post'
import { PostView } from '#/components/post-view'
import { Goback } from '#/components/goback'
import { appendStrPrefix } from '#/article'

interface Props {
  params: {
    slug: string
  }
}

// dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [configPath] = await fg('_config.toml')
  const configContent = await fs.readFile(configPath, 'utf-8')
  const { website } = toml.parse(configContent) as Config

  const post = await getPostBySlug(params.slug)
  const { title } = post ?? {}
  const rawTitle = website.title ?? 'Moji\' Blog'

  const metadata: Metadata = {
    title: rawTitle,
    keywords: [...website.keywords ?? [], ...post?.tags ?? []],
    description: post?.description,
  }

  if (title)
    metadata.title = `${rawTitle} - ${title}`

  return metadata
}

export async function generateStaticParams() {
  const slugs = await getSlugs()
  return slugs.map(slug => ({ slug }))
}

async function getPost(slug: string) {
  try {
    return await import(`#/../pages/posts/${slug}.md`)
  }
  catch (err) {
    console.error(err)
    return undefined
  }
}

export default async function PostPage(props: Props) {
  const postModule = await getPost(props.params.slug)

  if (!postModule)
    return notFound()

  const { default: MarkdownView, frontmatter } = postModule

  function getLocaleString(date: Date | string, lang: string) {
    return dayjs(date).toDate().toLocaleString(lang, { dateStyle: 'medium' })
  }

  return (
    <div className="mx-auto container">
      <div className="prose mb-8">
        <h1>{frontmatter.title}</h1>
        <p className="opacity-50">
          {getLocaleString(frontmatter.date, 'en')}
          <span>
            {appendStrPrefix(frontmatter.duration, ' · ')}
          </span>
        </p>
      </div>
      <PostView
        content={<MarkdownView />}
      >
        <Goback href="/" />
      </PostView>
    </div>
  )
}
