import { memo } from 'react'

export const DraftTips = memo(({ draft }: { draft?: boolean }) => {
  if (!draft)
    return undefined

  return (
    <p className="slide-enter bg-orange-400/10 text-orange-400 border-l-3 border-orange-400 px-4 py-2">
      This is a draft post, the content may be incomplete. Please check back later.
    </p>
  )
})
