import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import dayjs from 'dayjs'
import { getPostBySlug, getSlugs } from '#/core/post'
import { WrapperPost } from '#/components/WrapperPost'
import { Goback } from '#/components/goback'
import { appendStrPrefix } from '#/article'
import { getConfig } from '#/core/config'

interface Props {
  params: {
    slug: string
  }
}

// dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const website = await getConfig('website')

  const post = await getPostBySlug(params.slug)
  const { title } = post ?? {}
  const rawTitle = website.title ?? 'Moji\' Blog'

  const metadata: Metadata = {
    title: rawTitle,
    keywords: [...website.keywords ?? [], ...post?.tags ?? []],
    description: post?.description,
  }

  if (title) {
    metadata.title = `${title} - ${rawTitle}`
    metadata.openGraph = { title: metadata.title }
  }

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
      <WrapperPost
        content={<MarkdownView />}
        frontmatter={frontmatter}
      >
        <Goback href="/" />
      </WrapperPost>
    </div>
  )
}
