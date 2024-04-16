'use client'
import type { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import { NextUIProvider } from './NextUIProvider'

interface ProviderProps extends PropsWithChildren {
  defaultTheme?: string
}

export function Provider(props: ProviderProps) {
  return (
    <>
      <ThemeProvider enableSystem enableColorScheme attribute="class">
        <NextUIProvider>{props.children}</NextUIProvider>
      </ThemeProvider>
    </>
  )
}
