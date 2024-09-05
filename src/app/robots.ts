import type { MetadataRoute } from 'next'
import { getConfig } from '#/core/config'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const website = await getConfig('website')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: website.domain,
  }
}
