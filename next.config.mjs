import Shiki from '@shikijs/markdown-it'
import anchor from 'markdown-it-anchor'
import TOC from 'markdown-it-table-of-contents'
// @ts-check
import Markdown from 'unplugin-react-markdown/webpack'

import { slugify } from './scripts/slugify.js'

function parseMetaString(_metaString, _code, lang) {
  return {
    dataLanguage: lang,
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    reactCompiler: true
  },
  webpack: (config) => {
    config.plugins.push(Markdown({
      markdownItOptions: {
        breaks: true,
        xhtmlOut: true,
      },
      markdownItSetup: async (md) => {
        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          slugify,
          containerHeaderHtml: '<div class="table-of-contents-anchor"><span class="icon-[ri--menu-2-fill]"></span></div>',
        })

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
