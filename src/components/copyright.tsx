import { getConfig } from '#/core/config'
import Link from 'next/link'

export async function Copyright() {
  const website = await getConfig('website')

  return (
    <span className="text-sm opacity-50">
      <Link
        target="_blank"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        style={{
          color: 'inherit',
        }}
        rel="noreferrer"
      >
        CC BY-NC-SA 4.0
      </Link>
      {' '}
      2024-PRESENT ©
      {' '}
      {website.author}
    </span>
  )
}
