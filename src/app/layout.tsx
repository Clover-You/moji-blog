import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

import { Provider } from '#/lib/providers'
import { Sidbar } from '#/components/sidebar'
import { Header } from '#/components/header'
import { Banner } from '#/components/banner'

export const metadata: Metadata = {
  title: 'Clover\'s Blog',
  description: 'Hey, I am Clover You, welcome here!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body>
        <SpeedInsights />
        <Provider>
          <div className="trm-app-frame">
            <div className="trm-swup-animation" id="trm-dynamic-content">
              <div id="trm-scroll-container" className="trm-scroll-container" style={{ opacity: 1 }}>
                <Header />
                <div className="trm-content-start">
                  <Banner />
                  <div className="container w-full mx-auto px-5">
                    <div className="container mx-auto grid grid-rows-1 grid-cols-[320px_1fr] gap-10 z-0">
                      <Sidbar />
                      <div className="z-[2] overflow-hidden">{children}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  )
}
