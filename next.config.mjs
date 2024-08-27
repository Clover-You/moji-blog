// @ts-check
import Markdown from 'unplugin-react-markdown/webpack'
import Shiki from '@shikijs/markdown-it'

function parseMetaString(_metaString, _code, lang) {
  return {
    dataLanguage: lang,
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: (config) => {
    config.plugins.push(Markdown({
      markdownItSetup: async (md) => {
        md.use(await Shiki({
          themes: {
            light: 'vitesse-light',
            dark: 'nord',
          },
          theme: {
            colorReplacements: {
              '#2e3440ff': '#282a2d',
            },
          },
          parseMetaString,
        }))
      },
    }))
    return config
  },
}

export default nextConfig
