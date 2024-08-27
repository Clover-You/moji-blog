import { notFound } from 'next/navigation'
import { getPageMap } from '#/core/post'
import { PostView } from '#/components/post-view'

interface Props {
  params: {
    page: string
  }
}

export async function generateStaticParams() {
  const pageMap = await getPageMap()
  return Object.keys(pageMap).map(page => ({ page }))
}

async function getPage(page: string) {
  try {
    return await import(`#/../pages/${page}.md`)
  }
  catch (err) {
    console.error(err)
    return undefined
  }
}

export default async function Page(props: Props) {
  const page = await getPage(props.params.page)

  if (!page)
    return notFound()

  const { default: MarkdownView, frontmatter } = page

  return (
    <div className="mx-auto px-6 container">
      <div className="prose mb-8">
        <h1>{frontmatter.title}</h1>
      </div>

      <PostView>
        <MarkdownView />
      </PostView>
    </div>
  )
}
