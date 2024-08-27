'use client'
import Link from 'next/link'

interface GobackProps extends React.PropsWithChildren {
  href: string
}

export function Goback({ href, children }: GobackProps) {
  return (
    <span className="flex gap-2 opacity-50">
      <p className="!m-0">&gt;</p>
      <Link href={href}>{children ?? 'cd ..'}</Link>
    </span>
  )
}
