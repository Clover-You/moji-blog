import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import fg from 'fast-glob'
import fs from 'fs-extra'
import toml from 'toml'

import './globals.css'

import { Provider } from '#/lib/providers'
import { Header } from '#/components/header'
import { Copyright } from '#/components/copyright'

export async function generateMetadata(): Promise<Metadata> {
  const [configPath] = await fg('_config.toml')
  const configContent = await fs.readFile(configPath, 'utf-8')
  const { website } = toml.parse(configContent) as Config

  const title = website.title ?? 'Moji\'s Blog'

  return {
    title,
    description: website.description,
    keywords: website.keywords ?? ['blog', 'moji'],
    authors: [{
      name: website.author ?? 'Moji',
      url: 'https://www.ctong.top',
    }],
    openGraph: { title },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" data-theme="light" style={{ colorScheme: 'light' }}>
      <body>
        <SpeedInsights />
        <Provider>
          <Header />
          <main className="px-7 py-10 overflow-x-hidden">
            {children}
            <div className="container mx-auto mt-10 mb-6 flex">
              <Copyright />
              <div className="flex-auto"></div>
            </div>
          </main>
        </Provider>
      </body>
    </html>
  )
}
