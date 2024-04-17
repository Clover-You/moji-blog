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
  }

  if (title)
    metadata.title = `${rawTitle} - ${title}`

  return metadata
}

export async function generateStaticParams() {
  const slugs = await getSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function PostPage(props: Props) {
  const post = await getPostBySlug(props.params.slug)

  if (!post)
    return notFound()

  function getLocaleString(date: Date | string, lang: string) {
    return dayjs(date).toDate().toLocaleString(lang, { dateStyle: 'medium' })
  }

  return (
    <>
      <div className="mx-auto container">
        <div className="prose mb-8">
          <h1>{post.title}</h1>
          <p className="opacity-50">
            {getLocaleString(post.date, 'en')}
            <span>
              {appendStrPrefix(post.duration, ' · ')}
            </span>
          </p>
        </div>
        <PostView html={post.content}>
          <Goback href="/" />
        </PostView>
      </div>
    </>
  )
}
