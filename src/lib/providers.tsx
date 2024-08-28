'use client'
import type { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import { Theme } from '@radix-ui/themes'
import { NextUIProvider } from './NextUIProvider'

interface ProviderProps extends PropsWithChildren {
  defaultTheme?: string
}

export function Provider({ children }: ProviderProps) {
  return (
    <Theme>
      <ThemeProvider enableSystem enableColorScheme attribute="class">
        <NextUIProvider>{children}</NextUIProvider>
      </ThemeProvider>
    </Theme>
  )
}
