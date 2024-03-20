import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

import { inter } from './fonts'

import { Provider } from '#/lib/providers'
import { Sidbar } from '#/components/sidebar'
import { Header } from '#/components/header'
import { Banner } from '#/components/banner'

export const metadata: Metadata = {
  title: 'Clover\'sBlog',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <SpeedInsights />
        <Provider>
          <div className="w-screen h-screen overflow-y-auto border-solid border-[10px] border-blog-primary rounded-[20px] box-border bg-bg2">
            <Header />
            <Banner />
            <div className="container mx-auto grid grid-rows-1 grid-cols-[340px_1fr] gap-10 z-0">
              <Sidbar />
              <div className="z-[2]">{children}</div>
              Banner</div>
          </div>
        </Provider>
      </body>
    </html>
  )
}
