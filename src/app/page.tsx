import { PostList } from '#/components/post'
import { getPostList } from '#/core/post'

export default async function Home() {
  const posts = await getPostList()

  return (
    <div className="container mx-auto slide-enter-content">
      <PostList posts={posts} />
    </div>
  )
}
