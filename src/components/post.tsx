import { appendStrPrefix } from '#/article'
import dayjs from 'dayjs'
import Link from 'next/link'

interface PostListProps {
  posts: PostFrontmatter[]
}

export function PostList({ posts }: PostListProps) {
  const postGroupByTime: Record<string, PostFrontmatter[]> = {}

  posts.forEach((item) => {
    if (item.date) {
      const year = dayjs(item.date).format('YYYY')
      const list = postGroupByTime[year] ?? []

      list.push(item)

      postGroupByTime[year] = list
    }
  })

  const group = Object.entries(postGroupByTime)

  group.sort(([a], [b]) => Number(b ?? 0) - Number(a ?? 0))

  function getLocaleString(date: Date | string, lang: string) {
    return dayjs(date).toDate().toLocaleString(lang, { month: 'long', day: 'numeric' })
  }

  return (
    <ul>
      {group.map(([year, posts]) => {
        if (!year)
          return undefined

        return (
          <div aria-label={year} key={year}>
            <div className="h-20 relative -z-10">
              <span className="absolute -left-12 top-4 font-bold text-9xl text-transparent
                text-stroke-hex-aaa opacity-10"
              >
                {year}
              </span>
            </div>
            {posts?.map((post) => {
              return (
                <Link href={`posts/${post.slug}`} key={post.pid} className=" opacity-60  hover:opacity-100">
                  <li className="mt-2 mb-6 flex gap-2">
                    <div className="leading-5 text-lg">
                      <span>{post.title}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="whitespace-nowrap text-sm">{getLocaleString(post.date, 'en')}</span>
                      <span className="whitespace-nowrap text-sm">{appendStrPrefix(post.duration, ' · ')}</span>
                    </div>
                  </li>
                </Link>
              )
            })}
          </div>
        )
      })}
    </ul>
  )
}
