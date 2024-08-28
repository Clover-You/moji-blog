import type { MetadataRoute } from 'next'
import fg from 'fast-glob'
import fs from 'fs-extra'
import toml from 'toml'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const [configPath] = await fg('_config.toml')
  const configContent = await fs.readFile(configPath, 'utf-8')
  const { website } = toml.parse(configContent) as Config

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: website.domain,
  }
}
