import type { Metadata } from 'next'
import { Copyright } from '#/components/copyright'

import { Header } from '#/components/header'
import { getConfig } from '#/core/config'

import { Provider } from '#/lib/providers'
import { getDefaultTheme } from '#/utils/theme'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import './markdown.css'

export async function generateMetadata(): Promise<Metadata> {
  const website = await getConfig('website')
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
  const defaultTheme = await getDefaultTheme()

  return (
    <html lang="en" className={defaultTheme} style={{ colorScheme: defaultTheme }} suppressHydrationWarning>
      <body>
        <SpeedInsights />
        <Provider defaultTheme={defaultTheme}>
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
