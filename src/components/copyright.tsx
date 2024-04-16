import fg from 'fast-glob'
import fs from 'fs-extra'
import toml from 'toml'
import Link from 'next/link'

export async function Copyright() {
  const [configPath] = await fg('_config.toml')
  const configContent = await fs.readFile(configPath, 'utf-8')
  const config = toml.parse(configContent) as Config

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
      {config.website.author}
    </span>
  )
}
