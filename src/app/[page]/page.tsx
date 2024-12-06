import { WrapperPost } from '#/components/WrapperPost'
import { getPageMap } from '#/core/post'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    page: string
  }>
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
  const { page } = await props.params
  const pageMeta = await getPage(page)

  if (!page)
    return notFound()

  const { default: MarkdownView, frontmatter } = pageMeta

  return (
    <div className="mx-auto px-6 container">
      <div className="prose mb-8">
        <h1>{frontmatter.title}</h1>
      </div>

      <WrapperPost>
        <MarkdownView />
      </WrapperPost>
    </div>
  )
}
